const jwt= require("jsonwebtoken");

module.exports= function(req,res,next){
  const token=req.headers.authorization 

try{
    //checks if the token exist
    if (token){
//verifies the token
const decoded=jwt.verify(token, process.env.SECRET_KEY)
//catch the decoded data to the res.locals object
res.locals.id= decoded.id
//send the request to the next middleware
next()
 }
    else{
        res.status(403).json({success: false,message:"No token"})
  }
}catch(error){
    console.error(error);
        res.status(500).json({success: false,message:"invalid token"})
}
}
