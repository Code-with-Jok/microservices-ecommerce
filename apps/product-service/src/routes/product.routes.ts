import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router: Router = Router();

router.route("/").post(createProduct).get(getAllProducts);

router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

export default router;
