import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Sản phẩm được lấy thành công",
    products: [
      { id: 1, name: "Sản phẩm 1", price: 100 },
      { id: 2, name: "Sản phẩm 2", price: 200 },
    ],
  });
});

export default router;
