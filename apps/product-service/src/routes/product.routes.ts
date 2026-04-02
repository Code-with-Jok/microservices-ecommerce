import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { shouldBeUser } from "../middleware/auth.middleware.js";

const router: Router = Router();

router.route("/").post(shouldBeUser, createProduct).get(getAllProducts);

router
  .route("/:id")
  .get(getProduct)
  .put(shouldBeUser, updateProduct)
  .delete(shouldBeUser, deleteProduct);

export default router;
