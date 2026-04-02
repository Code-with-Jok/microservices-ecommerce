/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - shortDescription
 *         - description
 *         - price
 *         - sizes
 *         - colors
 *         - images
 *         - categorySlug
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the product
 *           example: 1
 *         name:
 *           type: string
 *           example: "Adidas CoreFit T-Shirt"
 *         shortDescription:
 *           type: string
 *           example: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit."
 *         description:
 *           type: string
 *           example: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit."
 *         price:
 *           type: number
 *           example: 39.9
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["s", "m", "l", "xl", "xxl"]
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["gray", "purple", "green"]
 *         images:
 *           type: object
 *           description: Map of colors to image URLs
 *           example: {
 *             "gray": "/products/1g.png",
 *             "purple": "/products/1p.png",
 *             "green": "/products/1gr.png"
 *           }
 *         categorySlug:
 *           type: string
 *           nullable: false
 *           example: "t-shirts"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-04-02T09:30:18Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-04-02T09:30:18Z"
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API quản lý sản phẩm
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Lấy thông tin sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sản phẩm
 *         example: 1
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   put:
 *     summary: Cập nhật thông tin sản phẩm
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sản phẩm
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   delete:
 *     summary: Xóa sản phẩm
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sản phẩm
 *         example: 1
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
