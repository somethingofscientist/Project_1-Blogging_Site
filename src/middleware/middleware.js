
const jwt = require ("jsonwebtoken");


let mid1 = function (req,res,next){
    try
     {
        let token = req.headers["x-Auth-token"];

    if (!token) token = req.headers["x-auth-token"];

    if (!token) return res.send({ status: false, msg: "token must be present" });
    console.log(token)
    next()
        
    } catch (error) {
        res.status(500).send({msg:"Token is not"})
    }

    
}


    // AUTHORISATION START HERE
    let mid2 = function (req,res,next){

    let decodedToken = jwt.verify(token, "project_1");
    const userId = req.params.userId
    const tokenId = decodedToken.userId
    console.log(decodedToken)

    if(tokenId != userId ) {
        res.send({ status: false, msg: "token is invalid" });
    }
    
    next()

}

module.exports.mid1 = mid1
module.exports.mid2 = mid2