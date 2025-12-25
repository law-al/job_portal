import type { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { CreateNote, GetNotesByApplicationId, GetNoteById, UpdateNote, DeleteNote } from '../services/notes.service.js';

// NOTE: Create a new note
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { applicationId } = req.params;
    const { content } = req.body;
    const userId = (req.user as any).id;

    if (!applicationId) {
      throw new BadRequestException('Application ID is required', ErrorCodes.BAD_REQUEST);
    }

    if (!content) {
      throw new BadRequestException('Note content is required', ErrorCodes.BAD_REQUEST);
    }

    const note = await CreateNote({
      applicationId,
      authorId: userId,
      content,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: Get all notes for an application
export const getNotesByApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, applicationId } = req.params;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!applicationId) {
      throw new BadRequestException('Application ID is required', ErrorCodes.BAD_REQUEST);
    }

    const notes = await GetNotesByApplicationId(applicationId, companyId);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: Get a single note by ID
export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, noteId } = req.params;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!noteId) {
      throw new BadRequestException('Note ID is required', ErrorCodes.BAD_REQUEST);
    }

    const note = await GetNoteById(noteId, companyId);

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: Update a note
export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, noteId } = req.params;
    const { content } = req.body;
    const userId = (req.user as any).id;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!noteId) {
      throw new BadRequestException('Note ID is required', ErrorCodes.BAD_REQUEST);
    }

    if (!content) {
      throw new BadRequestException('Note content is required', ErrorCodes.BAD_REQUEST);
    }

    const note = await UpdateNote(noteId, { content }, userId, companyId);

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: Delete a note
export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: companyId, noteId } = req.params;
    const userId = (req.user as any).id;

    if (!companyId) {
      throw new BadRequestException('Company ID is required', ErrorCodes.MISSING_COMPANY_ID);
    }

    if (!noteId) {
      throw new BadRequestException('Note ID is required', ErrorCodes.BAD_REQUEST);
    }

    const result = await DeleteNote(noteId, userId, companyId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
