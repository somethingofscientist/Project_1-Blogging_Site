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
    const filterQuery = { isDeleted: false, deletedAt: null, isPublished: true }
    const queryParams = req.query

    if (isValidRequestBody(queryParams)) {
      const { authorId, category, tags, subcategory } = queryParams

      if (isValid(authorId) && isValidObjectId(authorId)) {
        filterQuery['authorId'] = authorId
      }

      if (isValid(category)) {
        filterQuery['category'] = category.trim()
      }

      if (isValid(tags)) {
        const tagsArr = tags.trim().split(',').map(tag => tag.trim())
        filterQuery['tags'] = { $all: tagsArr }
      }

      if (isValid(subcategory)) {
        const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim())
        filterQuery['subcategory'] = { $all: subcatArr }
      }
    }

    const blogs = await blogModel.find(filterQuery)

    if (Array.isArray(blogs) && blogs.length === 0) {
      return res.status(404).send({ status: true, msg: "no blogs found" })
    }

    return res.status(200).send({ status: true, msg: "Blogs List", data: blogs })
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
      const params = req.params
      const blogId = params.blogId
      const authorIdFromToken = req.authorId

      if(!isValidObjectId(blogId)){
        return res.status(400).send({ status: false, msg: `${blogId} is not a valid blog Id` })
      }

      if(!isValidObjectId(authorIdFromToken)){
        return res.status(400).send({ status: false, msg: `${authorIdFromToken} is not a valid token Id` })
      }   

      const blog = await blogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null})

      if(!blog){
        return res.status(404).send({ status: false, msg: " Blog Not Found " })
      }

      if(blog.authorId.toString() !== authorIdfromToken ){
        return res.status(401).send({ status: false, msg: "You Are Unauthorized" })
      }
      // **==>
      await blogModel.findOneAndUpdate({_id: blogId}, {$set: {isDeleted: true, deletedAt: new Date() }})
      return res.status(200).send({ status: true, msg: " DATA IS DELETED " })
  }
      catch (error) {
      return res.status(500).send({ status: false, data: error.name })
}

  
}


const deleteBlogsQueryParams = async function (req, res) {
  try {
    const filterQuery = {isDeleted: false, deletedAt: null}
    const queryParams = req.query
    const authorIdFromToken = req.authorId

    if(!isValidObjectId(authorIdFromToken)){
      return res.status(400).send({ status: false, msg: `${authorIdFromToken} is not a valid token Id` })
    }  

    if(!isValidRequestBody(queryParams)){
      return res.status(400).send({ status: false, msg: `query params are empty` })
    }  

    const {authorId, category, tags, subcategory, isPublished} = queryParams
      
    if (isValid(authorId) && isValidObjectId(authorId)) {
      filterQuery['authorId'] = authorId
    }

    if (isValid(category)) {
      filterQuery['category'] = category.trim()
    }

    if (isValid(isPublished)) {
      filterQuery['isPublished'] = isPublished.trim()
    }

    if (isValid(tags)) {
      const tagsArr = tags.trim().split(',').map(tag => tag.trim())
      filterQuery['tags'] = { $all: tagsArr }
    }

    if (isValid(subcategory)) {
      const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim())
      filterQuery['subcategory'] = { $all: subcatArr }
    }

    const blogs = await blogModel.find(filterQuery)

    if (Array.isArray(blogs) && blogs.length === 0) {
      return res.status(404).send({ status: false, msg: "no blogs found" })
    }

    const idsOfBlogsToDelete = blogs.map(blog => {
        if(blog.authorId.toString() === authorIdFromToken ) return blog._id
    })

    if(idsOfBlogsToDelete.length === 0){
      return res.status(404).send({ status: false, msg: "Blogs List" })
    }

    await blogModel.updateMany(
      { _id: {$in: idsOfBlogsToDelete}},
      {$set:{ isDeleted: true, deletedAt: new Date()} }   
      )
    return res.status(200).send({ status: true, msg: "Blog is Deleted"  })
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