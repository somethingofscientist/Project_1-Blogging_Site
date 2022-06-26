const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const blogs = require("../controller/blogController")
const middleware = require("../middleware/middleware")



// AUTHOR CREATE
router.post("/authors", authors.createAuthor) //no need to enter token

// LOGIN AUTHOR
router.post("/login", authors.loginAuthor) //no need to enter token

// CREATE BLOG
router.post("/blogs", blogs.createBlog) //no need to enter token

// GET BLOG
router.get("/blogs", middleware.mid1, blogs.getBlog) //authentication

// UPDATE BLOG
router.put("/blogs/:blogId", middleware.mid1, middleware.mid2,  blogs.updateBlog)

// DELETE BLOG
router.delete("/deleteBlog/:blogId", middleware.mid1,middleware.mid2, blogs.deleteBlog)

// DELETE BLOG BY PARAMS
router.delete("/blogs", middleware.mid1, blogs.deleteBlogsQueryParams)



module.exports = router;