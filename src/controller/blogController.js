const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");


const createBlog = async function (req, res) {
  try {
    let data = req.body

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide blog details" })
    }

    // destructure from params
    const { title, body, authorId, tags, category } = data;

    if (!authorId) { return res.status(400).send(" Blog Author Id is not valid") }

    if (!body) { return res.status(400).send(" Blog  Body is required") }

    if (!title) { return res.status(400).send(" Blog Title is required") }

    if (!tags) { return res.status(400).send(" tags are not valid") }

    if (!category) { return res.status(400).send(" category is required") }

    const createAuthor = await authorModel.findById(authorId)

    if (!createAuthor) { return res.status(400).send({ msg: "author is not valid" }) }

    const savedData = await blogModel.create(data)
    res.status(201).send({ data: savedData })
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
}

const getBlog = async function (req, res) {
  try {
    let inputData = req.query.authorId
    if (inputData) {
      //TA SESSION CATEGORY DOUBT  LINE 27 & 33
      // let categorySelected = req.query.category
      let container = []
      let authorBlogs = await blogModel.find({ authorId: inputData }).populate("authorId")
      if (!authorBlogs) return res.status(404).send({ msg: "no data found" })

      authorBlogs.filter(afterFilter => {
        // afterFilter.category = categorySelected
        if (afterFilter.isDeleted == false && afterFilter.isPublished == false)
        container.push(afterFilter)

      })
      return res.status(200).send({ data: container, msg:authorBlogs })
    }
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
}

const updateBlog = async function (req, res) {
  try {
    let data = req.body
    let BlogId = req.params.blogId;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide blog details" })
    }

    let title = req.body.title
    let body = req.body.body
    let tags = req.body.tags
    let subcategory = req.body.subcategory
    let date1 = new Date()

    const updateZBlog = await blogModel.findOneAndUpdate({ _id: BlogId, isDeleted: false },
      {
        $set: {
          title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true,
          publishedAt: date1
        }
      },
      { new: true });

    res.status(200).send({ status: true, data: updateZBlog })

    // console.log(updateblog)
    // blogid exist ka bar m TA se dicuss
    // if do not provide the blog id

  } catch (err) {
    res.status(500).send({ msg: err.message })
  }
}


// delete blogs ===================================================
const deleteBlog = async function (req, res) {
  try {
    let BlogId = req.params.blogId
    let date = Date.now()
    let Blog = await blogModel.findById(BlogId)

    let check = await blogModel.findOne(
      { _id: BlogId },
      {
        isDeleted: 1,
        _id: 0,
      });

    //IF THE BLOG IS ALREADY DELETED   ???? BY TA ????
    if (check && check.isDeleted) {
      return res.status(404).send({ status: false, msg: "ALREADY DELETED" })
    }

    // WHEN WE PROVIDE WRONG ID
    if (!Blog) {
      return res.status(404).send({ status: false, msg: "BlogId Not Exist In DB" })
    }

    let afterDeleted = await blogModel.findOneAndUpdate(
      { _id: BlogId },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true })

    return res.status(200).send({ status: true, msg: "Data Is Deleted", data: { afterDeleted } })
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
// module.exports.deleteBlogsQueryParams = deleteBlogsQueryParams
