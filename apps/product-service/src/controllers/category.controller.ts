import { prisma, Prisma } from "@repo/product-db";
import { Request, Response, NextFunction } from "express";

/**
 * @desc Create a new category
 * @route POST /api/v1/categories
 */
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Prisma.CategoryCreateInput = req.body;

    const category = await prisma.category.create({ data });

    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json({ message: "Category already exists" });
    }
    next(error);
  }
};

/**
 * @desc Update a category
 * @route PUT /api/v1/categories/:id
 */
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const data: Prisma.CategoryUpdateInput = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data,
    });

    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Category not found" });
    }
    next(error);
  }
};

/**
 * @desc Delete a category
 * @route DELETE /api/v1/categories/:id
 */
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Category not found" });
    }
    next(error);
  }
};

/**
 * @desc Get category by ID
 * @route GET /api/v1/categories/:id
 */
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all categories
 * @route GET /api/v1/categories
 */
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    next(error);
  }
};
