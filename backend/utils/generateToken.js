const jwt = require("jsonwebtoken");
require("dotenv").config(); 
let jwtSecretKey = process.env.JWT_SECRET_KEY;
const generateToken = (data)=>{
   try {
     const token = jwt.sign(data, jwtSecretKey,{
         expiresIn:"30d"
     });
     return token;
   } catch (error) {
    console.log(error);
    
   }
}

module.exports = generateToken;
