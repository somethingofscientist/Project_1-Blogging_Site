

const { truncate } = require("fs")
const mongoose = require("mongoose")
const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")

// CREATE AUTHOR
const createAuthor = async function (req, res) {
  let data = req.body
  const savedData = await authorModel.create(data)
  res.status(200).send({ data: savedData }) //ALL GOOD... //status(200)- OK
}

// CREATE BLOG
const createBlog = async function (req, res) {
    let data = req.body
    if(!data.authorId) {return res.status(400).send("author Id Is Not Valid")}
    const savedData = await blogModel.create(data)
    res.status(201).send({ data: savedData }) //ALL GOOD... //status(201)- OK

  }

  // GET BLOG 
  const getBlog = async function (req, res) {
    try
        {
          let data = req.query.authorId
          let mainData = []
          // if(!data) {return res.send("author Id Is Not Valid")}
          // Ask In TA Round  
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

  // UPDATE BLOG
  const Updateblog = async function (req, res) {
    
    try 
    {
        let title = req.body.title
        let body = req.body.body
        let category = req.body.category
        let tag = req.body.tag
        let date = new Date().toLocaleString();
        let Id = req.params.blogId

        const blogs = await blogModel.findOneAndUpdate({_id:Id},{$set:{title:title ,body:body ,category:category ,tag:tag ,isPublished:true ,publishedAt:date }},{new:true, upsert:true})
        res.status(200).send({msg:blogs})

      } 
      catch (error) {
        res.status(500).send({msg:"Data not found"})
      }
    }


    const deleteBlogByParams = async function (req, res ){
      try
      {
        let category = req.params.category
        let authorId = req.params.authorId
        let tag = req.params.tag
        let subcategory = req.params.subcategory
        let unpublished = req.params.unpublished

        const blogs = await blogModel.findOneAndUpdate({_id:Id},{$set:
          {
            category:category ,
            authorId:authorId ,
            tag:tag ,
            subcategory:subcategory ,
            unpublished:unpublished
          }},{new:true, upsert:true})
        res.status(200).send({msg:blogs})

      }
      catch(error){
        res.status(404).send({ msg: "Blog Document Is Not Exist" })
      }
    }


module.exports.createAuthor = createAuthor
module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.Updateblog = Updateblog
module.exports.deleteBlogByParams = deleteBlogByParams