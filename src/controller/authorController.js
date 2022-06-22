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
    if(!data.authorId) {return res.send("author Id Is Not Valid")}
    const savedData = await blogModel.create(data)
    res.status(201).send({ data: savedData }) //ALL GOOD... //status(201)- OK
}


const getBlog = async function (req, res) {
  try
      {
        let data = req.query.authorId
        let mainData = []
        if(!data) {return res.send("author Id Is Not Valid")}
        let blogsData = await blogModel.find({ authorId: data})
        
        blogsData.filter( afterFilter =>{

          if( afterFilter.isDeleted == false ) 
              mainData.push(afterFilter)
        })
        res.status(200).send({ status: true , data: mainData }) 

      }

  catch(error){
        res.status(404).send({ status: false , msg: "No Document Is Found"})
      }
}


module.exports.createAuthor = createAuthor
module.exports.createBlog = createBlog
module.exports.getBlog = getBlog