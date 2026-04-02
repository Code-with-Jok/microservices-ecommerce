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
    const { 
      name, 
      shortDescription, 
      description, 
      price, 
      categorySlug, 
      colors, 
      images,
      sizes 
    } = req.body;

    // Explicit validation for required fields
    if (!name || !shortDescription || !description || price === undefined || !categorySlug) {
      return res.status(400).json({ 
        message: "Missing required fields: name, shortDescription, description, price, and categorySlug are required." 
      });
    }

    const validationError = validateColorsAndImages(colors as string[], images);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Explicitly construct create input to ensure it matches Prisma's expectation
    const product = await prisma.product.create({ 
      data: {
        name,
        shortDescription,
        description,
        price: Number(price),
        sizes: sizes || [],
        colors: colors || [],
        images: images || {},
        category: {
          connect: { slug: categorySlug }
        }
      }
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(400).json({ message: "Category not found for the provided slug" });
    }
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
    const productId = Number(id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const body = req.body;

    // Merge logic for colors and images if either is provided
    if (body.colors || body.images) {
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const mergedColors = (body.colors as string[]) || (existingProduct.colors as string[]);
      const mergedImages = (body.images as any) || (existingProduct.images as any);

      const validationError = validateColorsAndImages(mergedColors, mergedImages);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
    }

    // If categorySlug is in body, use connect logic
    const updateData: any = { ...body };
    if (body.categorySlug) {
      updateData.category = {
        connect: { slug: body.categorySlug }
      };
      delete updateData.categorySlug;
    }
    if (body.price) {
      updateData.price = Number(body.price);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
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
      return res.status(404).json({ message: "Product or Category not found" });
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
    const productId = Number(id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
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
    const productId = Number(id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
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
