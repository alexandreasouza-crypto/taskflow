import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

const taskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  order: z.number().int().optional(),
});

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { status, priority, categoryId, tagId, search } = req.query;

    const whereClause: any = { userId };

    if (status) {
      whereClause.status = String(status);
    }
    if (priority) {
      whereClause.priority = String(priority);
    }
    if (categoryId) {
      whereClause.categoryId = String(categoryId);
    }
    if (tagId) {
      whereClause.tags = {
        some: { tagId: String(tagId) },
      };
    }
    if (search) {
      const searchStr = String(search);
      whereClause.OR = [
        { title: { contains: searchStr } },
        { description: { contains: searchStr } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Erro ao listar tarefas.' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const validatedData = taskSchema.parse(req.body);

    const dueDate = validatedData.dueDate ? new Date(validatedData.dueDate) : null;
    const completedAt = validatedData.status === 'COMPLETED' ? new Date() : null;

    const task = await prisma.task.create({
      data: {
        userId,
        title: validatedData.title,
        description: validatedData.description || null,
        dueDate,
        priority: validatedData.priority,
        status: validatedData.status,
        completedAt,
        categoryId: validatedData.categoryId || null,
        order: validatedData.order || 0,
        tags: validatedData.tagIds && validatedData.tagIds.length > 0
          ? {
              create: validatedData.tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.status(201).json({ task });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);
    const validatedData = taskSchema.partial().parse(req.body);

    const existing = await prisma.task.findFirst({
      where: { id, userId },
      include: { tags: true },
    });

    if (!existing) {
      res.status(404).json({ error: 'Tarefa não encontrada.' });
      return;
    }

    let completedAt = existing.completedAt;
    if (validatedData.status) {
      if (validatedData.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
        completedAt = new Date();
      } else if (validatedData.status !== 'COMPLETED' && existing.status === 'COMPLETED') {
        completedAt = null;
      }
    }

    const updateData: any = {
      ...(validatedData.title !== undefined && { title: validatedData.title }),
      ...(validatedData.description !== undefined && { description: validatedData.description }),
      ...(validatedData.dueDate !== undefined && {
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      }),
      ...(validatedData.priority !== undefined && { priority: validatedData.priority }),
      ...(validatedData.status !== undefined && { status: validatedData.status, completedAt }),
      ...(validatedData.categoryId !== undefined && { categoryId: validatedData.categoryId }),
      ...(validatedData.order !== undefined && { order: validatedData.order }),
    };

    if (validatedData.tagIds !== undefined) {
      // Remove old associations and create new ones
      await prisma.taskTag.deleteMany({
        where: { taskId: id },
      });

      if (validatedData.tagIds.length > 0) {
        updateData.tags = {
          create: validatedData.tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        };
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.json({ task });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
};

export const updateTaskStatusAndOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);
    const { status, order } = req.body;

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Tarefa não encontrada.' });
      return;
    }

    let completedAt = existing.completedAt;
    if (status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      completedAt = new Date();
    } else if (status && status !== 'COMPLETED' && existing.status === 'COMPLETED') {
      completedAt = null;
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(order !== undefined && { order }),
        completedAt,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.json({ task });
  } catch (error) {
    console.error('Update status/order error:', error);
    res.status(500).json({ error: 'Erro ao mover tarefa.' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Tarefa não encontrada.' });
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: 'Tarefa excluída com sucesso.' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Erro ao excluir tarefa.' });
  }
};
