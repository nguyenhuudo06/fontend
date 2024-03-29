const Product = require("../models/ProductModel");
const bcrybt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

// Kết hợp promise và async (tìm hiểu chưa kỹ)
const createProduct = (newProduct) => {

    const { name, image, type, price, countInStock, rating, description } = newProduct;
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                name: name
            })

            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already',
                });
            }

            const createNewProduct = await Product.create({
                name, image, type, price, countInStock, rating, description
            })

            if (createNewProduct) {
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: createNewProduct
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            });
            console.log('checkProduct', checkProduct);

            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not dedined',
                });
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
            console.log(updatedProduct);

            resolve({
                status: 'OK',
                message: 'Success',
                data: updatedProduct
            });
        } catch (e) {
            reject(e);
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            });
            console.log('checkProduct', checkProduct);

            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined',
                });
            }

            await Product.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Deletes product success'
            });
        } catch (e) {
            reject(e);
        }
    })
}

const getAllProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();

            let query = {};
            // (Đã check nhưng chưa hiểu) Kiểm tra nếu có tham số filter trong query
            if (req.query.filter) {
                const filters = req.query.filter.split(",");

                // filters.forEach((filter) => {
                //     const [key, value] = filter.split(":");
                //     query[key] = { $regex: value, $options: "i" };
                // });


                filters.forEach((filter) => {
                    const [key, value] = filter.split(":");
                    // Kiểm tra nếu key là "name", áp dụng $regex để tìm các chuỗi con
                    if (key === "name") {
                        const keywords = value.split(" "); // Tách các từ trong chuỗi tìm kiếm
                        const regex = keywords.map(keyword => `(?=.*${keyword})`).join(""); // Tạo mẫu regex
                        query[key] = { $regex: new RegExp(regex, "i") }; // "i" để tìm kiếm không phân biệt chữ hoa chữ thường
                    } else {
                        query[key] = value;
                    }
                });
            }

            // (Đã check) Sắp xếp theo tham số sort nếu có (Đã check)
            let sortQuery = {};
            if (req.query.sort) {
                const [key, value] = req.query.sort.split(":");
                sortQuery[key] = value === "desc" ? -1 : 1;
            }

            // (Đã check) Giới hạn số lượng kết quả nếu có tham số limit
            const limit = req.query.limit ? Number(req.query.limit) : 4;
            console.log('limit: ', limit)

            // (Đã check) Lấy số trang hiện tại từ query
            const page = req.query.page ? Number(req.query.page) : 1;
            console.log('page: ', page)

            // (Đã check) Bỏ qua số lượng theo page
            const skip = (Number(page) - 1) * limit;
            console.log('skip: ', skip)

            // (Đã check) Kiểm tra nếu trang không có dữ liệu
            if (page < 1 || (page - 1) * limit >= totalProduct) {
                return resolve({
                    status: 'OK',
                    message: 'No data available for this page',
                    data: [],
                    total: totalProduct,
                    curentPage: page,
                    totalPage: Math.ceil(totalProduct / limit)
                });
            }

            // (Đã check) Tìm kiếm sản phẩm với các điều kiện đã được xác định
            const products = await Product.find(query)
                .sort(sortQuery)
                .limit(limit)
                .skip(skip);

            resolve({
                status: 'OK',
                message: 'Get all product success',
                data: products,
                total: totalProduct,
                curentPage: page,
                totalPage: limit == 0 ? 1 : Math.ceil(totalProduct / limit)
            });
        } catch (e) {
            reject(e);
        }
    })
}



const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            });
            console.log('checkProduct', checkProduct);

            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined',
                });
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: checkProduct
            });
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getDetailProduct
}