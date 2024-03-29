const User = require("../models/UserModel");
const bcrybt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

// Kết hợp promise và async (tìm hiểu chưa kỹ)
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser !== null) {
                resolve({
                    status: 'OK',
                    message: 'The email is already',
                });
            }

            const hash = bcrybt.hashSync(password, 10);
            console.log('hash', hash);
            const createNewUser = await User.create({
                name, email, password: hash, phone
            })

            if (createNewUser) {
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: createNewUser
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = userLogin;
        try {
            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not dedined',
                });
            }

            // So sánh mật khẩu
            const comparePassword = bcrybt.compareSync(password, checkUser.password);
            console.log('comparePassword', comparePassword);

            if (!comparePassword) {
                resolve({
                    status: 'OK',
                    message: 'The email or password is in correct',
                });
            }
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            console.log(access_token);

            // Trả về token => lưu ở local => dùng trong request api
            resolve({
                status: 'OK',
                message: 'Success',
                access_token,
                refresh_token
            });
        } catch (e) {
            reject(e);
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            });
            console.log('checkUser', checkUser);

            if(checkUser === null){
                resolve({
                    status: 'OK',
                    message: 'The user is not dedined',
                });
            }

            const updateUser = await User.findByIdAndUpdate(id, data, {new: true});
            console.log(updateUser);

            resolve({
                status: 'OK',
                message: 'Success',
                data: updateUser
            });
        } catch (e) {
            reject(e);
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            });
            console.log('checkUser', checkUser);

            if(checkUser === null){
                resolve({
                    status: 'OK',
                    message: 'The user is not defined',
                });
            }

            // await User.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Deletes user success'
            });
        } catch (e) {
            reject(e);
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();

            resolve({
                status: 'OK',
                message: 'Get all user success',
                data: allUser
            });
        } catch (e) {
            reject(e);
        }
    })
}

const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            });
            console.log('checkUser', checkUser);

            if(checkUser === null){
                resolve({
                    status: 'OK',
                    message: 'The user is not defined',
                });
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: checkUser
            });
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser
}