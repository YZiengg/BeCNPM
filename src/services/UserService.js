const User=require ("../models/UserModel")
const bcrypt =require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            const checkUser = await User.findOne({email:email})
            if(checkUser !== null) {
                resolve({
                    status: "OK",
                    message:"email is invalid"
                })
            }
            const hash=bcrypt.hashSync(password,10)
                const createdUser = await User.create({
                name,
                email,
                password: hash,
                confirmPassword: hash,
                phone
            });
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser,
                });
            } else {
                resolve({ status: 'ERR', message: 'Failed to create user.' });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = userLogin;
        try {
            const checkUser = await User.findOne({email:email})
            if(checkUser === null) {
                resolve({
                    status: "OK",
                    message:"email is not defined"
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password )
            if(!comparePassword){
                resolve({
                    status: "OK",
                    message:"The password or user is incorrect"
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            })
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token, 
                    refresh_token
                });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({_id:id})
            if(checkUser === null) {
                resolve({
                    status: "OK",
                    message:"email is not defined"
                })
            }

            const updateUser = await User.findByIdAndUpdate(id, data)
            console.log('updateUser', updateUser)

                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createUser, 
    loginUser,
    updateUser,
};
