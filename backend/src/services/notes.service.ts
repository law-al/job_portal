import { Note } from '../models/note/note.model.js';
import { NotFoundException, BadRequestException, ForbiddenException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';
import { prisma } from '../utils/prismaClient.js';
import { CreateActivity } from './activities.service.js';

interface CreateNoteData {
  applicationId: string;
  authorId: string;
  content: string;
}

interface UpdateNoteData {
  content: string;
}

// NOTE: Create a new note
export const CreateNote = async (data: CreateNoteData) => {
  try {
    if (!data.content || data.content.trim().length === 0) {
      throw new BadRequestException('Note content is required', ErrorCodes.BAD_REQUEST);
    }

    if (data.content.length > 5000) {
      throw new BadRequestException('Note content cannot exceed 5000 characters', ErrorCodes.BAD_REQUEST);
    }

    // Verify application exists and get companyId
    const application = await prisma.application.findFirst({
      where: {
        id: data.applicationId,
      },
      select: {
        id: true,
        companyId: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found', ErrorCodes.APPLICATION_NOT_FOUND);
    }

    // Verify author is a member of the company
    const userCompany = await prisma.userCompany.findFirst({
      where: {
        userId: data.authorId,
        companyId: application.companyId,
        status: 'ACTIVE',
      },
    });

    if (!userCompany) {
      throw new ForbiddenException('You do not have permission to create notes for this application', ErrorCodes.FORBIDDEN);
    }

    const note = await Note.create({
      applicationId: data.applicationId,
      authorId: data.authorId,
      content: data.content.trim(),
    });

    // Create NOTE_ADDED activity
    try {
      await CreateActivity(
        {
          applicationId: data.applicationId,
          actorId: data.authorId,
          type: 'NOTE_ADDED',
          message: 'A note was added',
          metadata: {
            noteId: note._id.toString(),
            notePreview: data.content.trim().substring(0, 100),
          },
        },
        application.companyId,
      );
    } catch (error) {
      // Log error but don't fail the note creation
      console.error('Failed to create activity for note creation:', error);
    }

    return {
      id: note._id.toString(),
      applicationId: note.applicationId,
      authorId: note.authorId,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

// NOTE: Get all notes for an application
export const GetNotesByApplicationId = async (applicationId: string, companyId: string) => {
  try {
    // Verify application exists and belongs to company
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        companyId,
      },
      select: {
        id: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found', ErrorCodes.APPLICATION_NOT_FOUND);
    }

    const notes = await Note.find({
      applicationId,
    })
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    // Get author information from Prisma
    const authorIds = [...new Set(notes.map((note) => note.authorId))];
    const authors = await prisma.userCompany.findMany({
      where: {
        userId: {
          in: authorIds,
        },
        companyId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    const authorMap = new Map(authors.map((author) => [author.userId, author.user]));

    return notes.map((note) => ({
      id: note._id.toString(),
      applicationId: note.applicationId,
      author: authorMap.get(note.authorId) || { id: note.authorId, email: 'Unknown' },
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));
  } catch (error) {
    throw error;
  }
};

// NOTE: Get a single note by ID
export const GetNoteById = async (noteId: string, companyId: string) => {
  try {
    const note = await Note.findById(noteId).lean();

    if (!note) {
      throw new NotFoundException('Note not found', ErrorCodes.RECORD_NOT_FOUND);
    }

    // Verify application belongs to company
    const application = await prisma.application.findFirst({
      where: {
        id: note.applicationId,
        companyId,
      },
      select: {
        id: true,
      },
    });

    if (!application) {
      throw new ForbiddenException('You do not have permission to access this note', ErrorCodes.FORBIDDEN);
    }

    // Get author information
    const author = await prisma.userCompany.findFirst({
      where: {
        userId: note.authorId,
        companyId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return {
      id: note._id.toString(),
      applicationId: note.applicationId,
      author: author?.user || { id: note.authorId, email: 'Unknown' },
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

// NOTE: Update a note
export const UpdateNote = async (noteId: string, data: UpdateNoteData, userId: string, companyId: string) => {
  try {
    if (!data.content || data.content.trim().length === 0) {
      throw new BadRequestException('Note content is required', ErrorCodes.BAD_REQUEST);
    }

    if (data.content.length > 5000) {
      throw new BadRequestException('Note content cannot exceed 5000 characters', ErrorCodes.BAD_REQUEST);
    }

    const note = await Note.findById(noteId);

    if (!note) {
      throw new NotFoundException('Note not found', ErrorCodes.RECORD_NOT_FOUND);
    }

    // Verify the user is the author
    if (note.authorId !== userId) {
      throw new ForbiddenException('You can only update your own notes', ErrorCodes.FORBIDDEN);
    }

    // Verify application belongs to company
    const application = await prisma.application.findFirst({
      where: {
        id: note.applicationId,
        companyId,
      },
      select: {
        id: true,
      },
    });

    if (!application) {
      throw new ForbiddenException('You do not have permission to update this note', ErrorCodes.FORBIDDEN);
    }

    note.content = data.content.trim();
    await note.save();

    return {
      id: note._id.toString(),
      applicationId: note.applicationId,
      authorId: note.authorId,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

// NOTE: Delete a note
export const DeleteNote = async (noteId: string, userId: string, companyId: string) => {
  try {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new NotFoundException('Note not found', ErrorCodes.RECORD_NOT_FOUND);
    }

    // Verify the user is the author
    if (note.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own notes', ErrorCodes.FORBIDDEN);
    }

    // Verify application belongs to company
    const application = await prisma.application.findFirst({
      where: {
        id: note.applicationId,
        companyId,
      },
      select: {
        id: true,
      },
    });

    if (!application) {
      throw new ForbiddenException('You do not have permission to delete this note', ErrorCodes.FORBIDDEN);
    }

    await Note.findByIdAndDelete(noteId);

    return { success: true, message: 'Note deleted successfully' };
  } catch (error) {
    throw error;
  }
};
