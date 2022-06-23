
const jwt = require ("jsonwebtoken");


let mid1 = function (req,res,next){

    let token = req.headers["x-Auth-token"];
    console.log(token)

    if (!token) token = req.headers["x-auth-token"];

    if (!token) return res.send({ status: false, msg: "token must be present" });
    console.log(token)


    // AUTHORISATION START HERE
    let decodedToken = jwt.verify(token, "project_1");
    const userId = req.params.userId
    const tokenId = decodedToken.userId
    console.log(decodedToken)

    if(tokenId != userId ) {
        res.send({ status: false, msg: "token is invalid" });
    }
    else{
        next()
    }

}
module.exports.mid1 = mid1