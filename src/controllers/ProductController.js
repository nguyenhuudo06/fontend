const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
    try {
        console.log(req.body);
        const { name, image, type, price, countInStock, rating, description } = req.body;

        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }

        console.log(description);
        const response = await ProductService.createProduct(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const data = req.body;
        console.log('productId', productId);

        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product ID is required'
            });
        }
        const response = await ProductService.updateProduct(productId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const token = req.headers;
        console.log('token', token);

        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product ID is required'
            });
        }
        const response = await ProductService.getDetailProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const token = req.headers;
        console.log('token', token);

        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product ID is required'
            });
        }
        const response = await ProductService.deleteProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const response = await ProductService.getAllProduct(req);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct
}