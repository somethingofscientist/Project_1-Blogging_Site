const mongoose = require("mongoose")
const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel")



const isValid = function (value)
 { if (typeof value === "undefined" || value === null ) return false 
 if (typeof value === "string" && value.trim().length === 0) return false 
 return true }



// aprit
// CREATE AUTHOR
const createAuthor = async function (req, res) {
  try {
    let data = req.body

    console.log(data)
    
    if(!isValid(data.fname)) {
      return res.status(400).send({ status:false ,msg:"please Enter Valid Name" })
    }

    // if(!(/\d/.test(data.fname))) {
    //   return res.status(404).send({ status:false ,msg:"please Enter Valid Name" })
    // }

    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
      return res.status(400).send({ status:false ,msg:"please Enter Valid Email" })
    }

    const isEmailPresent = await authorModel.findOne({ email:data.email})
    if(isEmailPresent) {
      return res.status(400).send({ status:false ,msg:"Email already exist" })
    }

    // same catch paste
    const savedData = await authorModel.create(data)
    return res.status(200).send({ data: savedData })
  }

  catch (err) {
    return res.status(500).send({status:false,  data:err.message})
}

}


// AUTHENTICATION PART============================  
const loginAuthor = async function (req, res) {
  try {
    let username = req.body.emailId;
    let password = req.body.password;

    if (!username) {
      return res.status(400).send({ status: false, msg: " please Enter Username" })
    }

    if (!password) {
      return res.status(400).send({ status: false, msg: " please Enter password" })
    }

    let user = await authorModel.findOne({ emailId: username, password: password });
    if (!user) return res.send({ status: false, msg: " username or password is incorrect " });

    // AUTHENTICATION BEGINS HERE===================

    let token = jwt.sign(
      {
        authorId: user._id.toString(),
      },
      "project_1");

    res.send({
      status: true,
      token: "Login SuccessFully, Token sent in header 'x-api-key'",
      data: { token: token }
    });
  }

  catch (err) {
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};



// new 
// authentication and authorisation
module.exports.loginAuthor = loginAuthor
module.exports.createAuthor = createAuthor