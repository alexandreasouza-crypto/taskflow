import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

const tagSchema = z.object({
  name: z.string().min(1, 'O nome da tag é obrigatório'),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Cor inválida (formato hex #RRGGBB)').default('#64748b'),
});

export const getTags = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const tags = await prisma.tag.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ tags });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Erro ao listar tags.' });
  }
};

export const createTag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const validatedData = tagSchema.parse(req.body);

    const tag = await prisma.tag.create({
      data: {
        userId,
        name: validatedData.name,
        color: validatedData.color,
      },
    });

    res.status(201).json({ tag });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Create tag error:', error);
    res.status(500).json({ error: 'Erro ao criar tag.' });
  }
};

export const updateTag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);
    const validatedData = tagSchema.partial().parse(req.body);

    const existing = await prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Tag não encontrada.' });
      return;
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: validatedData,
    });

    res.json({ tag });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Update tag error:', error);
    res.status(500).json({ error: 'Erro ao atualizar tag.' });
  }
};

export const deleteTag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    const existing = await prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Tag não encontrada.' });
      return;
    }

    await prisma.tag.delete({
      where: { id },
    });

    res.json({ message: 'Tag excluída com sucesso.' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: 'Erro ao excluir tag.' });
  }
};
