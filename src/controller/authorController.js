const mongoose = require("mongoose")
const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken");


// make a function for validation for the fname in the author

const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}


// Sahil
// CREATE AUTHOR
const createAuthor = async function (req, res) {
  try {
    let data = req.body

    // function to validate empty spaces
    function onlySpaces(str) {
      return /^\s*$/.test(str);
    }

    // VALIDATION:
    // fname validation
    // if (!data.fname) {
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "Please Enter fname(required field) " });
    // } 

    // else if (onlySpaces(data.fname) == true) {
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "fname cannot be a empty" });
    // } 

    // else if (!isNaN(data.fname)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "fname cannot be a number" });
    // }

    // =================================
    if (!isValid(data.fname)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid Name" })
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
      return res.status(400).send({ status: false, msg: "please Enter Valid Email" })
    }

    const isEmailPresent = await authorModel.findOne({ email: data.email })
    if (isEmailPresent) {
      return res.status(400).send({ status: false, msg: "Email already exist" })
    }

    const savedData = await authorModel.create(data)
    return res.status(200).send({ data: savedData })
  }

  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
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
    return res.status(500).send({ status: false, data: err.message })
  }
};


module.exports.loginAuthor = loginAuthor
module.exports.createAuthor = createAuthor