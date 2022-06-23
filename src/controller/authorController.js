const mongoose = require("mongoose")
const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken");


// make a function for validation for the fname in the author

const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}

// CREATE AUTHOR
const createAuthor = async function (req, res) {
  try {
    let data = req.body

    // ALL THE EDGE CASES ARE HERE FOR THE CREATE AUTHOR

    // function to validate empty spaces
    // not able to understand but it is REGEX
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
      return res.status(400).send({ status: false, msg: "EmailId Is Already Exist In DB" })
    }

    // AUTHOR CREATED HERE

    const savedData = await authorModel.create(data)
    return res.status(200).send({ data: savedData })
  }

  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }

}

// LOGIN USER OR AUTHOR ==========================
// AUTHENTICATION PART ===========================  
const loginAuthor = async function (req, res) {
  try {
    let username = req.body.emailId;
    let password = req.body.password;

    // edges cases
    if (!username) {
      return res.status(400).send({ status: false, msg: " please Enter Username" })
    }

    if (!password) {
      return res.status(400).send({ status: false, msg: " please Enter password" })
    }

    let user = await authorModel.findOne({ 
      emailId: username, 
      password: password 
    });
    
    if (!user) return res.status(400).send({ 
      status: false, 
      msg: " username or password is incorrect " 
    });

    // AUTHENTICATION BEGINS HERE===================

    let token = jwt.sign({
      // provide the things which are unique like object id
        authorId: user._id.toString(),
      },
      "project_1"
      );

    res.status(200).send({
      status: true,
      token: "You Are Now Login In The App",
      data: { token: token }
    });
  }

  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
};


module.exports.loginAuthor = loginAuthor
module.exports.createAuthor = createAuthor