/* eslint-disable no-useless-catch */
const bcrypt = require('bcrypt');
const User = require('../../model/user');
const jwt  = require('jsonwebtoken');
require('dotenv/config');
const salt = 12;

module.exports = {
    login: async({email,password})=>{
        try{
            const user = await User.findOne({email:email});
            if(!user){
                throw new Error('User does not exist');
            }
            const password_match = await bcrypt.compare(password,user.password);
            if(!password_match){
                throw new Error('Password does not match'); 
            }
            const token = jwt.sign({
                userId:user.id,
                email:user.email
            }, process.env.PRIVATE_KEY ,{
                expiresIn:'1h'            
            });
            return{
                userId:user.id,
                token:token,
                tokenExpiration:'Expires in 1 hr'
            };
        }catch(err){
            throw err;
        }

    },
    createUser: async (args) => {
        try {
            try {
                const user = await User.findOne({ email: args.userInput.email });
                if (user) {
                    throw new Error('User exist already');
                }
                const hash = await bcrypt.hash((args.userInput.password), salt);
                const user_1 = new User({
                    email: args.userInput.email,
                    password: hash
                });
                const result = await user_1.save();
                console.log(result);
                return { ...result._doc, _id: result.id, password: null };
            } catch (err) {
                console.log(err);
                throw err;
            }
        } catch (err_1) {
            console.log(err_1);
            throw err_1;
        }
    },
   
};