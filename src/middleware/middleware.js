const jwt =require ("jasonwebtoken");

let mid1 = function (req, res, next){

    let token = req.headers["x-Auth-token"];
    console.log(token)

    if (!token) token = req.headers["x-auth-token"];

}