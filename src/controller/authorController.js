const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken");


    // make a function for validation for the fname,lname,title in the author
    // By TA
    const isValid = function (value) {
      if (typeof value === "undefined" || value === null) return false
      if (typeof value === "string" && value.trim().length === 0) return false
      return true
    }

    const isValidTitle = function (title) {
      return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
    }

    const isValidRequestBody = function (data) {
      return Object.keys(requestBody).length > 0
    }
    

// CREATE AUTHOR
const createAuthor = async function (req, res) {
  try {

    let data = req.body
    if (!isValidRequestBody(data) ) {
      return res.status(400).send({ msg: "Please provide blog details" })
    }

    const {fname, lname, title, email, password} = data
    // ALL THE EDGE CASES ARE HERE FOR THE CREATE AUTHOR

    if (!isValid(fname)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid first name" })
    }

    if (!isValid(lname)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid last name" })
    }

    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid Title" })
    }
    
    if (!isValidTitle(title)) {
      return res.status(400).send({ status: false, msg: "title should be Mr Mrs Miss" })
    }

    if (!isValid(email)) {
      return res.status(400).send({ status: false, msg: "email is required" })
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      return res.status(400).send({ status: false, msg: "email should be Valid Email" })
    }

    const isEmailPresent = await authorModel.findOne({ email: data.email })

    if (isEmailPresent) {
      return res.status(400).send({ status: false, msg: "EmailId Is Already Exist In DB" })
    }

    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: " Please enter password" });
    }

    // create author
    
    const authorData = {fname, lname, title, email, password}
    const savedData = await authorModel.create(authorData)
    return res.status(200).send({ data: savedData })
  }

  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }

}

// LOGIN AUTHOR ==========================
const loginAuthor = async function (req, res) {

  try {

    let data = req.body
    if (!isValidRequestBody(data) ) {
      return res.status(400).send({ msg: "Please provide blog details" })
    }

    let email = req.body.email
    let password = req.body.password


    if (!isValid(email)) {
      return res.status(400).send({ status: false, msg: "email is required" })
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      return res.status(400).send({ status: false, msg: "email should be Valid Email" })
    }
    // req.body.email is used in postman it can be change both sides

    let user = await authorModel.findOne({
      email: email,
      password: password
    })


    if (!user) return res.status(400).send({
      status: false,
      msg: " username or password is incorrect "
    })


    // AUTHENTICATION BEGINS HERE===================

    let token = jwt.sign({
      // provide the things which are unique like object id
      authorId: user._id.toString(),
      iat :Math.floor(Date.now() / 1000),
      exp :Math.floor(Date.now() / 1000) + 10*60*60,
      batch: "Radon",
    },
      "project_1"   // =============>   secret key 
    );

    res.header('x-api-key' , token)
    res.status(200).send({
      status: true,
      token: "You Are Login In The App",
      data: { token }
    });
  }

  catch (err) {
    return res.status(500).send({ status: false, data0: err.name, data1: err.message })
  }
}

module.exports.loginAuthor = loginAuthor
module.exports.createAuthor = createAuthor