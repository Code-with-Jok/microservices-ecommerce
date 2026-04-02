import { prisma, Prisma } from "@repo/product-db";
import { Request, Response, NextFunction } from "express";

/**
 * Helper to validate colors and images
 */
const validateColorsAndImages = (colors: string[], images: any) => {
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return "Colors array is required and cannot be empty!";
  }

  if (!images || typeof images !== "object") {
    return "Images object is required!";
  }

  const missingColors = colors.filter((color) => !(color in images));
  if (missingColors.length > 0) {
    return `Missing images for colors: ${missingColors.join(", ")}`;
  }

  return null;
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Prisma.ProductCreateInput = req.body;
    const { colors, images } = data;

    const validationError = validateColorsAndImages(colors as string[], images);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await prisma.product.create({ data });

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data: Prisma.ProductUpdateInput = req.body;

    // Optional: Validation if colors or images are provided in the update
    if (data.colors || data.images) {
      // Need to fetch current data to validate full set if only partial set is updated
      // For simplicity, we just check if both are provided in the body for now
      if (Array.isArray(data.colors) && data.images) {
        const validationError = validateColorsAndImages(
          data.colors as string[],
          data.images
        );
        if (validationError) {
          return res.status(400).json({ message: validationError });
        }
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Product not found" });
    }
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedProduct = await prisma.product.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Product not found" });
    }
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    next(error);
  }
};
