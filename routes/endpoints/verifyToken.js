require('dotenv').config()
const jwt = require('jsonwebtoken')

console.log(process.env.ACCESS_KEY)
const verifyToken = (req,res,next) => {
  const authHeader = req.headers.token
  if(authHeader) {
    jwt.verify(token, process.env.JWT_SEC, (err,admin) => {
      if(err) res.status(403).json('Token is not valid');
      req.admin = admin;
      next();
    })
  }else{
    return res.status(401).json('you are not aunthenticated')
  }
}

module.exports = {verifyToken};