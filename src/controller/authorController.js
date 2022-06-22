
const mongoose = require("mongoose")
const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")


const createAuthor = async function (req, res) {
  let data = req.body
  const savedData = await authorModel.create(data)
  res.status(200).send({ data: savedData }) //ALL GOOD... //status(200)- OK
}

const createBlog = async function (req, res) {
    let data = req.body
    if(!data.authorId) {return res.status(400).send("author Id Is Not Valid")}
    const savedData = await blogModel.create(data)
    res.status(201).send({ data: savedData }) //ALL GOOD... //status(201)- OK
}
const getBlog = async function (req, res) {
    const savedData = await blogModel.find().$and[{isDeleted:false},{ispublished:true}]
    if(!savedData){return res.send("not found")}
    res.status(201).send({ data: savedData }) //ALL GOOD... //status(201)- OK
}

module.exports.createAuthor = createAuthor
module.exports.createBlog = createBlog
module.exports.getBlog = getBlog