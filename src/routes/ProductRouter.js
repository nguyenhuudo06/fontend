const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/create', ProductController.createProduct);
router.put('/update/:id', authMiddleware, ProductController.updateProduct);
router.get('/details/:id', ProductController.getDetailProduct);
router.delete('/delete/:id', ProductController.deleteProduct);
router.get('/get-all', ProductController.getAllProduct);


module.exports = router;