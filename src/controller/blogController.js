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





    const savedData = await blogModel.create(data)
    res.status(201).send({ data: savedData })
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
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
    let category = req.body.category
    let subcategory = req.body.subcategory
    let date1 = new Date()

    const updateZBlog = await blogModel.findOneAndUpdate({ _id: BlogId, isDeleted: false },
      {
        $set: {
          title: title, body: body, tags: tags, category: category, subcategory: subcategory, isPublished: true,
          publishedAt: date1
        }
      }, { new: true });


    // res.status(200).send({ status: true, data:  updateZBlog })

    const blogdata = updateZBlog ?? "BLog not found"
    res.status(200).send({ status: true, data: blogdata })

    // console.log(updateblog)
    // blogid exist ka bar m TA se dicuss
    // if do not provide the blog id

  } catch (err) {
    res.status(500).send({ msg: err.name })
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
    return res.status(500).send({ status: false, data: err.name })
  }
}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogsQueryParams = deleteBlogsQueryParams