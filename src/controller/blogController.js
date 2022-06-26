const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");

const createBlog = async function (req, res) {
  try {

    let data = req.body

    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Please provide blog details"
      })
    }

    // destructure from params

    const { title, body, authorId, tags, category } = data;


    if (!authorId) {
      return res.status(400).send({
        status: false,
        msg: " Blog Author Id is not valid"
      })
    }

    if (!body) {
      return res.status(400).send({
        status: false,
        msg: " Blog body is not valid"
      })
    }

    if (!title) {
      return res.status(400).send({
        status: false,
        msg: " Blog Title is required"
      })
    }

    if (!tags) {
      return res.status(400).send({
        status: false,
        msg: " tags are not valid"
      })
    }

    if (!category) {
      return res.status(400).send({
        status: false,
        msg: " category is required"
      })
    }

    const createAuthor = await authorModel.findById(authorId)

    if (!createAuthor) {
      return res.status(400).send({
        status: false,
        msg: "author is not valid"
      })
    }

    const savedData = await blogModel.create(data)
    res.status(201).send({
      status: true,
      data: savedData
    })
  }
  catch (err) {
    return res.status(500).send({
      status: false,
      data: err.message
    })
  }
}

const getBlog = async function (req, res) {

  try {

    let data = req.query.authorId
    if (data) {
      let categorySel = req.query.category
      let blogsData = []
      let blogs = await blogModel.find({ authorId: data })
      if (!blogs) return res.status(404).send({
        status: false,
        msg: "No Data Found"
      })
      
      blogs.filter(afterFilter => {
        afterFilter.category = categorySel
        if (afterFilter.isDeleted == false && afterFilter.isPublished == true)
        blogsData.push(afterFilter)
        
      })

      if (blogsData.length==0) return res.status(404).send({
        status: false,
        msg: "No Document are Found"
      })


      return res.status(200).send({
        status: true,
        data1: blogsData
      })

    }
    else {
      let blogs = await blogModel.find({ isDeleted: false, isPublished: true })
      return res.status(200).send({
        status: true,
        data2: blogs
      })
    }
  }
  catch (err) {
    return res.status(500).send({
      status: false,
      data: err.message
    })
  }
}




const updateBlog = async function (req, res) {
  try {
    let data = req.body
    let BlogId = req.params.blogId;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Please provide blog details"
      })
    }

    let title = req.body.title
    let body = req.body.body
    let tags = req.body.tags
    let subcategory = req.body.subcategory
    let date1 = new Date()

    const updateBlog = await blogModel.findOneAndUpdate({ _id: BlogId, isDeleted: false },
      {
        $set: {
          title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true,
          publishedAt: date1
        }
      }, { new: true });

    const blogdata = updateBlog ?? "BLog not found"

    res.status(200).send({ status: true, data: blogdata })

  } catch (err) {
    res.status(500).send({ msg: err.message })
  }
}


// delete blogs ===================================================



const deleteBlog = async function (req, res) {
  try {
    let BlogId = req.params.blogId
    let date = new Date()
    let Blog = await blogModel.findById(BlogId)
    if (!Blog) {
      return res.status(404).send({
        status: false,
        msg: "Blog Id does not exists"
      })
    }

    let check = await blogModel.findOneAndUpdate({ _id: BlogId },
      
      {$set:{isDeleted:true , deletedAt:date}},{new:true})

      return res.status(200).send({status:true,msg:"Data deleted successful",data:check})

    // //IF THE BLOG IS ALREADY DELETED   ???? BY TA ????
    // if (check && check.isDeleted) {
    //   return res.status(404).send({ status: false, msg: "ALREADY DELETED" })
    // }

    // // WHEN WE PROVIDE WRONG ID
    // if (!Blog) {
    //   return res.status(404).send({ status: false, msg: "BlogId Not Exist In DB" })
    // }
  }

  catch (err) {
    return res.status(500).send({ status: false, data: err.name })
  }
}


//deleteby params are not get understand

const deleteBlogsQueryParams = async function (req, res) {
  try {

    let Inuser = req.authorId

    let queryparms = req.query;

    let data2 = new Date()

    if (Object.keys(queryparms).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Please provide key value details"
      })
    }

    const blogs = await blogModel.find({ ...queryparms, isDeleted: false, authorId: Inuser })

    if (blogs.length == 0) {
      return res.status(404).send({
        status: false,
        msg: "blogs does not exists"
      })
    }

    const deleteBlog = await blogModel.updateMany({ _id: { $in: blogs } },
      { $set: { isDeleted: true, deletedAt: data2 } })

    res.status(200).send({
      status: true,
      msg: "Data is Deleted By Query",
      data: deleteBlog
    })
  }
  catch (err) {
    return res.status(500).send({
      status: false,
      data: err.message
    })
  }
}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogsQueryParams = deleteBlogsQueryParams