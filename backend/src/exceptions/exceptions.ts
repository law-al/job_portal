import { ApiError, ErrorCodes } from './index.js';

export class ValidationException extends ApiError {
  constructor(
    message: string,
    public errorCode: ErrorCodes,
    public error: any = null,
  ) {
    super(message, 400, errorCode, error);
  }
}

export class BadRequestException extends ApiError {
  constructor(
    message: string = 'Bad Request',
    public errorCode: ErrorCodes,
    public error: any = null,
  ) {
    super(message, 400, errorCode, error);
  }
}

// 401 - Unauthorized
export class UnauthorizedException extends ApiError {
  constructor(
    message: string = 'Unauthorized',
    public error: any = null,
  ) {
    super(message, 401, ErrorCodes.UNAUTHORIZED, error);
  }
}

export class InvalidCredentialsException extends ApiError {
  constructor(
    message: string = 'Invalid credentials',
    public error: any = null,
  ) {
    super(message, 401, ErrorCodes.INVALID_CREDENTIALS, error);
  }
}

export class TokenExpiredException extends ApiError {
  constructor(
    message: string = 'Token has expired, unauthorized',
    public error: any = null,
  ) {
    super(message, 401, ErrorCodes.TOKEN_EXPIRED, error);
  }
}

export class InvalidTokenException extends ApiError {
  constructor(
    message: string = 'Invalid token',
    public error: any = null,
  ) {
    super(message, 401, ErrorCodes.TOKEN_INVALID, error);
  }
}

// 403 - Forbidden
export class ForbiddenException extends ApiError {
  constructor(
    message: string = 'Access forbidden',
    public error: any = null,
  ) {
    super(message, 403, ErrorCodes.FORBIDDEN, error);
  }
}

export class InsufficientPermissionsException extends ApiError {
  constructor(
    message: string = 'Insufficient permissions',
    public error: any = null,
  ) {
    super(message, 403, ErrorCodes.INSUFFICIENT_PERMISSIONS, error);
  }
}

// 404 - Not Found
export class NotFoundException extends ApiError {
  constructor(
    message: string = 'Resource not found',
    public error: any = null,
  ) {
    super(message, 404, ErrorCodes.RECORD_NOT_FOUND, error);
  }
}

export class UserNotFoundException extends ApiError {
  constructor(
    message: string = 'User not found',
    public error: any = null,
  ) {
    super(message, 404, ErrorCodes.USER_NOT_FOUND, error);
  }
}

export class JobNotFoundException extends ApiError {
  constructor(
    message: string = 'Job not found',
    public error: any = null,
  ) {
    super(message, 404, ErrorCodes.JOB_NOT_FOUND, error);
  }
}

export class ApplicationNotFoundException extends ApiError {
  constructor(
    message: string = 'Application not found',
    public error: any = null,
  ) {
    super(message, 404, ErrorCodes.APPLICATION_NOT_FOUND, error);
  }
}

// 409 - Conflict
export class ConflictException extends ApiError {
  constructor(
    message: string = 'Resource conflict',
    public error: any = null,
  ) {
    super(message, 409, ErrorCodes.RESOURCE_CONFLICT, error);
  }
}

export class DuplicateException extends ApiError {
  constructor(
    message: string = 'Resource already exists',
    public error: any = null,
  ) {
    super(message, 409, ErrorCodes.DUPLICATE_ENTRY, error);
  }
}

export class EmailAlreadyExistsException extends ApiError {
  constructor(
    message: string = 'Email already exists',
    public error: any = null,
  ) {
    super(message, 409, ErrorCodes.EMAIL_ALREADY_EXISTS, error);
  }
}

export class UniqueConstraintException extends ApiError {
  constructor(
    message: string = 'Unique constraint violation',
    public field?: string,
    public error: any = null,
  ) {
    super(message, 409, ErrorCodes.UNIQUE_CONSTRAINT, error);
  }
}

export class ForeignKeyConstraintException extends ApiError {
  constructor(
    message: string = 'Foreign key constraint failed',
    public error: any = null,
  ) {
    super(message, 409, ErrorCodes.FOREIGN_KEY_CONSTRAINT, error);
  }
}

// 422 - Unprocessable Entity
export class UnprocessableEntityException extends ApiError {
  constructor(
    message: string = 'Unprocessable entity',
    public error: any = null,
  ) {
    super(message, 422, ErrorCodes.UNPROCESSABLE_ENTITY, error);
  }
}

// 429 - Too Many Requests
export class TooManyRequestsException extends ApiError {
  constructor(
    message: string = 'Too many requests',
    public error: any = null,
  ) {
    super(message, 429, ErrorCodes.TOO_MANY_REQUESTS, error);
  }
}

export class RateLimitException extends ApiError {
  constructor(
    message: string = 'Rate limit exceeded',
    public error: any = null,
  ) {
    super(message, 429, ErrorCodes.RATE_LIMIT_EXCEEDED, error);
  }
}

// 500 - Internal Server Error
export class InternalServerException extends ApiError {
  constructor(
    message: string = 'Internal server error',
    public error: any = null,
  ) {
    super(message, 500, ErrorCodes.INTERNAL_SERVER_ERROR, error);
  }
}

export class DatabaseException extends ApiError {
  constructor(
    message: string = 'Database error',
    public error: any = null,
  ) {
    super(message, 500, ErrorCodes.DATABASE_ERROR, error);
  }
}

// 501 - Not Implemented
export class NotImplementedException extends ApiError {
  constructor(
    message: string = 'Not implemented',
    public error: any = null,
  ) {
    super(message, 501, ErrorCodes.NOT_IMPLEMENTED, error);
  }
}

// 502 - Bad Gateway
export class BadGatewayException extends ApiError {
  constructor(
    message: string = 'Bad gateway',
    public error: any = null,
  ) {
    super(message, 502, ErrorCodes.BAD_GATEWAY, error);
  }
}

export class ExternalApiException extends ApiError {
  constructor(
    message: string = 'External API error',
    public error: any = null,
  ) {
    super(message, 502, ErrorCodes.EXTERNAL_API_ERROR, error);
  }
}

// 503 - Service Unavailable
export class ServiceUnavailableException extends ApiError {
  constructor(
    message: string = 'Service unavailable',
    public error: any = null,
  ) {
    super(message, 503, ErrorCodes.SERVICE_UNAVAILABLE, error);
  }
}

// 504 - Gateway Timeout
export class GatewayTimeoutException extends ApiError {
  constructor(
    message: string = 'Gateway timeout',
    public error: any = null,
  ) {
    super(message, 504, ErrorCodes.GATEWAY_TIMEOUT, error);
  }
}

// File/Upload Related
export class FileTooLargeException extends ApiError {
  constructor(
    message: string = 'File too large',
    public error: any = null,
  ) {
    super(message, 413, ErrorCodes.FILE_TOO_LARGE, error);
  }
}

export class InvalidFileTypeException extends ApiError {
  constructor(
    message: string = 'Invalid file type',
    public error: any = null,
  ) {
    super(message, 400, ErrorCodes.INVALID_FILE_TYPE, error);
  }
}

export class FileUploadException extends ApiError {
  constructor(
    message: string = 'File upload failed',
    public error: any = null,
  ) {
    super(message, 500, ErrorCodes.FILE_UPLOAD_FAILED, error);
  }
}

// Payment Related
export class PaymentRequiredException extends ApiError {
  constructor(
    message: string = 'Payment required',
    public error: any = null,
  ) {
    super(message, 402, ErrorCodes.PAYMENT_REQUIRED, error);
  }
}

export class PaymentFailedException extends ApiError {
  constructor(
    message: string = 'Payment failed',
    public error: any = null,
  ) {
    super(message, 402, ErrorCodes.PAYMENT_FAILED, error);
  }
}

// Email Related
export class EmailSendFailedException extends ApiError {
  constructor(
    message: string = 'Failed to send email',
    public error: any = null,
  ) {
    super(message, 500, ErrorCodes.EMAIL_SEND_FAILED, error);
  }
}

// Business Logic
export class OperationNotAllowedException extends ApiError {
  constructor(
    message: string = 'Operation not allowed',
    public error: any = null,
  ) {
    super(message, 403, ErrorCodes.OPERATION_NOT_ALLOWED, error);
  }
}

export class JWTNotPresent extends ApiError {
  constructor(
    message: string = 'Access forbidden',
    public error: any = null,
  ) {
    super(message, 401, ErrorCodes.ACCESS_TOKEN_NOT_FOUND, error);
  }
}
