

const { truncate } = require("fs")
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
  
  
  
//   const getBlog = async function (req, res) {
    
//     let field = req.body.Id
//     const Allblog = await blogModel.find({authorId:Id})
//     Allblog.filter(a=>{
//       if(a.isDeleted==false)
//     })

  
//   res.status(201).send({ data: list }) //ALL GOOD... //status(201)- OK
// }
  const Updateblog = async function (req, res) {
    
    try {
      let title = req.body.title
      let body = req.body.body
      let category = req.body.category
      let tag = req.body.tag
      let date = new Date().toLocaleString();
      let Id = req.params.blogId
      const blogs = await blogModel.findOneAndUpdate({_id:Id},{$set:{title:title ,body:body,
        category:category,tag:tag,isPublished:true , publishedAt:date }},{new:true,upsert:true})

        res.status(200).send({msg:blogs})

      } catch (error) {
        
        res.status(500).send({msg:"Data not found"})
      }

    }


module.exports.createAuthor = createAuthor
module.exports.createBlog = createBlog
module.exports.Updateblog = Updateblog