import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

const categorySchema = z.object({
  name: z.string().min(1, 'O nome da categoria é obrigatório'),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Cor inválida (formato hex #RRGGBB)').default('#3b82f6'),
});

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Erro ao listar categorias.' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const validatedData = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: {
        userId,
        name: validatedData.name,
        color: validatedData.color,
      },
    });

    res.status(201).json({ category });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Erro ao criar categoria.' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);
    const validatedData = categorySchema.partial().parse(req.body);

    const existing = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Categoria não encontrada.' });
      return;
    }

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    });

    res.json({ category });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria.' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    const existing = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Categoria não encontrada.' });
      return;
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: 'Categoria excluída com sucesso.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Erro ao excluir categoria.' });
  }
};
