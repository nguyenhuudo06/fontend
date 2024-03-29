const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

// Tạo access token
const generalAccessToken = async (payload) =>{
    console.log('payload', payload);
    const accessToken = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30s' });

    return accessToken;
}

// Tạo refresh token
const generalRefreshToken = async (payload) =>{
    console.log('payload', payload);
    const refreshToken = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' });

    return refreshToken;
}

// Cấp lại access token
const refreshTokenJwtService = async (token) =>{
    return new Promise(async (resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if(err){
                console.log('err', err);
                    resolve({
                        status: 'ERR',
                        message: 'The authentication'
                    });
                }
                
                const { payload } = user;

                const access_token = await generalAccessToken({
                    id: payload?.id,
                    isAdmin: payload?.isAdmin
                });

                console.log('access_token', access_token)
                resolve({
                    status: 'OK',
                    message: 'Success !!!',
                    access_token
                });
            })
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJwtService
}