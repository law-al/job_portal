import type { NextFunction, Request, Response } from 'express';
import { ApiError, ErrorCodes } from '../exceptions/index.js';
import logger from '../utils/logger.js';
import z, { ZodError } from 'zod';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/client';

const handleZodErrors = (err: ZodError) => {
  const { fieldErrors } = z.flattenError(err);
  const fieldErrorskeys = Object.keys(fieldErrors);
  const newErrorObject = {} as Record<string, string>;

  fieldErrorskeys.forEach((key) => {
    newErrorObject[key] = fieldErrors[key as keyof typeof fieldErrors][0];
  });
  return new ApiError(
    'validation error',
    404,
    ErrorCodes.VALIDATION_ERROR,
    newErrorObject,
  );
};

const handlePrismaValidationError = (
  err: PrismaClientValidationError,
): ApiError => {
  return new ApiError(
    'Invalid input data. Please check your request.',
    400,
    ErrorCodes.VALIDATION_ERROR,
    null,
  );
};

const handlePrismaInitializationError = (
  err: PrismaClientInitializationError,
): ApiError => {
  return new ApiError(
    'Database connection failed. Please try again later.',
    500,
    ErrorCodes.DATABASE_CONNECTION_FAILED,
    null,
  );
};

const handlePrismaRustPanicError = (
  err: PrismaClientRustPanicError,
): ApiError => {
  return new ApiError(
    'Critical database error occurred. Please try again.',
    500,
    ErrorCodes.DATABASE_CRITICAL_ERROR,
    null,
  );
};

const handlePrismaClientKnownRequestError = (
  err: PrismaClientKnownRequestError,
) => {
  const errorMap: Record<string, () => ApiError> = {
    P2002: () => {
      const driverAdapterError = (err.meta as any)?.driverAdapterError;
      const constraintFields = driverAdapterError?.cause?.constraint?.fields as
        | string[]
        | undefined;
      // Fallback to standard meta.target (regular Prisma)
      const fields =
        constraintFields || (err.meta?.target as string[] | undefined);

      const fieldName = fields?.join(', ') || 'field';
      return new ApiError(
        `Duplicate value found for ${fieldName}. Please use a different value.`,
        404,
        ErrorCodes.UNIQUE_CONSTRAINT,
        null,
      );
    },

    P2003: () => {
      const field =
        (err.meta?.field_name as string) ||
        (err.meta?.target as string) ||
        'unknown field';

      return new ApiError(
        `Invalid reference for field: ${field}`,
        400,
        ErrorCodes.FOREIGN_KEY_CONSTRAINT,
        null,
      );
    },

    P2025: () =>
      new ApiError('Record not found.', 404, ErrorCodes.RECORD_NOT_FOUND, null),
    P2021: () =>
      new ApiError(
        'The table does not exist.',
        500,
        ErrorCodes.RECORD_NOT_FOUND,
        null,
      ),
    P2022: () =>
      new ApiError(
        'The column does not exist.',
        500,
        ErrorCodes.RECORD_NOT_FOUND,
        null,
      ),
  };

  return (
    errorMap[err.code]?.() ||
    new ApiError(
      'Database error occurred.',
      500,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      err,
    )
  );
};

function devErrors(err: ApiError, res: Response) {
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    code: err.errorCode,
    error: err.error,
    stack: err.stack,
  });
}

function prodErrors(err: ApiError, res: Response) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.errorCode,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let apiError: ApiError;
  if (err instanceof ApiError) {
    apiError = err;
  } else if (err instanceof ZodError) {
    console.log(err);
    apiError = handleZodErrors(err);
  } else if (err instanceof PrismaClientValidationError) {
    apiError = handlePrismaValidationError(err);
  } else if (err instanceof PrismaClientKnownRequestError) {
    apiError = handlePrismaClientKnownRequestError(err);
  } else if (err instanceof PrismaClientRustPanicError) {
    apiError = handlePrismaRustPanicError(err);
  } else if (err instanceof PrismaClientInitializationError) {
    apiError = handlePrismaInitializationError(err);
  } else {
    console.log('Error', err);
    // logger.error('Error', err, {
    //   message: err.message,
    //   stack: err.stack,
    //   url: req.originalUrl,
    //   method: req.method,
    //   ip: req.ip,
    //   body: req.body,
    //   params: req.params,
    //   query: req.query,
    // });

    apiError = new ApiError(
      'Something went wrong',
      500,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      err,
    );
  }

  if (process.env.NODE_ENV === 'development') {
    devErrors(apiError, res);
  } else {
    prodErrors(apiError, res);
  }
};

export default errorHandler;
