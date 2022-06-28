const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}

const isValidRequestBody = function (data) {
  return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (objectId) {
  return mongoose.type.ObjectId.isValid(objectId)
}

const createBlog = async function (req, res) {
  try {

    let data = req.body
    if (!isValidRequestBody(data)) {
      return res.status(400).send({ msg: "Please provide blog details" })
    }

    const { title, category, authorId, subcategory, tags, body, isPublished } = data
    // ALL THE EDGE CASES ARE HERE FOR THE CREATE AUTHOR

    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid Title" })
    }

    if (!isValid(body)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid body name" })
    }

    if (!isValid(authorId)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid authorId name" })
    }

    if (!isValidObjectId(authorId)) {
      return res.status(400).send({ status: false, msg: `${authoId} is not a valid authorId` })
    }

    if (!isValid(category)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid category name" })
    }

    const author = await authorModel.findById(authorId)

    if (!author) {
      return res.status(400).send({ status: false, msg: "author does not exist" })
    }

    // validation end

    const blogData = {
      title,
      body,
      authorId,
      category,
      isPublished: isPublished ? isPublished : true,
      publishedAt: ispublished ? new Date() : null

    }
    if (tags) {

      if (Array.isArray(tags)) {
        blogData["tags"] = [...tags]
      }
      if (object.prototype.tostring.call(tags) === "[object string]") {
        blogData["tags"] = [tags]
      }
      if (Array.isArray(subcategory)) {
        blogData["subcategory"] = [...subcategory]
      }
      if (object.prototype.tostring.call(subcategory) === "[object string]") {
        blogData["subcategory"] = [subcategory]
      }
    }

    const savedData = await blogModel.create(blogData)
    res.status(201).send({ status: true, msg: "New blog create successfully", data: savedData })


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

    const filterquery = { isDeleted: false, deletedAt: null, publishedAt: true }
    const queryparms = req.query

    if (isValidRequestBody(queryparms)) {

      const { authorid, tags, category, subcategory } = queryparms
    }


    if (category) {
      let verifyCategory = await blogModel.findOne({ category: category })
      if (!verifyCategory) {
        return res.status(400).send({ status: false, msg: "No Blogs In This Category Exist" })
      }
    }
    if (tags) {
      let verifyTag = await blogModel.findOne({ tags: tags })
      if (!verifyTag) {
        return res.status(400).send({ status: false, msg: "No Blogs In This Tags Exist" })
      }
    }
    if (subcategory) {
      let verifySubcategory = await blogModel.findOne({ subcategory: subcategory })
      if (!verifySubcategory) {
        return res.status(400).send({ status: false, msg: "No Blogs In This SubCategory Exist" })
      }
    }

    if (authorId) {
      if (!mongoose.isValidObjectId(authorId))
        return res.status(400).send({ status: false, msg: "Invalid AuthorId" })
    }



    let getRecord = await blogModel.find(filter).populate("authorId")
    console.log(getRecord)


    if (getRecord.length == 0) {
      return res.status(404).send({
        "msg": "Data Not Found"
      })
    }

    return res.status(200).send({ status: true, msg: "get", data: getRecord })
  }
  catch (err) {
    res.status(500).send({ msg: err.name })
  }

}






// update blogs ===================================================



const updateBlog = async function (req, res) {
  try {

    const requestBody = req.body
    const params = req.params
    const blogId = params.blogId
    const authorIdfromtoken = req.authorId

    // validation start

    if (isValidObjectId(blogId)) {

      res.status(400).send({ status: false, msg: `${blogId} is not a valid blogId` })

    }

    if (isValidObjectId(authorIdfromtoken)) {

      res.status(400).send({ status: false, msg: `${authorIdfromtoken} is not a valid blogId` })

    }
    const Blog = await blogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null })

    if (!Blog) {
      res.status(404).send({ status: false, msg: "Blog not found" })

    }

    if (blog.authorId.tostring() !== authorIdfromtoken) {

      res.status(401).send({ status: false, msg: "unauthorized access !" })
    }

    if (!isValidRequestBody(requestbody)) {
      res.status(200).send({ status: true, msg: "No parameter pass ! blog unmodified", data: Blog })
    }

    // extract params

    const { title, body, tags, category, subcategory, ispublished } = requestBody

    const updateBlogData = {}

    if (isValid(title)) {
      if (object.prototype.hasOwnProperty.call(updateBlogData, "$set")) updateBlogData["$set"] = {}

      updataBlogData["$set"]["title"] = title
    }
    if (isValid(body)) {
      if (object.prototype.hasOwnProperty.call(updateBlogData, "$set")) updateBlogData["$set"] = {}

      updataBlogData["$set"]["body"] = body
    }

    if (isValid(category)) {
      if (object.prototype.hasOwnProperty.call(updateBlogData, "$set")) updateBlogData["$set"] = {}

      updataBlogData["$set"]["category"] = category
    }

    if (ispublished !== undefined) {

      if (object.prototype.hasOwnProperty.call(updateBlogData, "$set")) updateBlogData["$set"] = {}

      updataBlogData["$set"]["ispublished"] = ispublished
      updataBlogData["$set"]["ispublished"] = ispublished ? new date() : null
    }

    if (tags) {

      if (object.prototype.hasOwnProperty.call(updateBlogData, "$addtoset")) updateBlogData["$addtoset"] = {}

      if (Array.isArray(tags)) {
        updataBlogData["$addtoset"]["tags"] = { $each: [...tags] }

      }
      if (typeof tags == "string") {

        updataBlogData["$addtoset"]["tags"] = tags
      }
    }
    if (subcategory) {

      if (object.prototype.hasOwnProperty.call(updateBlogData, "$addtoset")) updateBlogData["$addtoset"] = {}

      if (Array.isArray(subcategory)) {
        updataBlogData["$addtoset"]["subcategory"] = { $each: [...subcategory] }

      }
      if (typeof subcategory == "string") {

        updataBlogData["$addtoset"]["subcategory"] = subcategory
      }
    }

    const updateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, updateBlogData, { new: true })

    res.status(200).send({ status: true, msg: "Blog update successfully", data: updateBlog })
  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message })
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
    let check = await blogModel.findOneAndUpdate(
      { _id: BlogId },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true })

    //IF THE BLOG IS ALREADY DELETED   ???? BY TA ????

    if (check && check.isDeleted) {
      return res.status(404).send({ status: false, msg: "ALREADY DELETED" })
    }


    return res.status(200).send({ status: true, msg: " DATA IS DELETED ", data: check })

  }

  catch (error) {
    return res.status(500).send({ status: false, data: error.name })
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