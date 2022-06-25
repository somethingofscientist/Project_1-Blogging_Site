const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const blogs = require("../controller/blogController")
const middleware = require("../middleware/middleware")


// LOGIN AUTHOR
router.post("/login", authors.loginAuthor)

// CREATE AUTHOR
router.post("/authors",authors.createAuthor)

// CREATE BLOG
router.post("/blogs", middleware.mid1, blogs.createBlog)

// GET BLOG
router.get("/blogs", middleware.mid1, blogs.getBlog)

// UPDATE BLOG
router.put("/blogs/:blogId", middleware.mid1,blogs.updateBlog)

// DELETE BLOG
router.delete("/deleteBlog/:blogId", middleware.mid1, blogs.deleteBlog)


// router.delete("/deleteBlogsQueryParams", middleware.mid1, blogs.deleteBlogsQueryParams)
// router.delete("/deleteBlogsByQueryParams",blogs.deleteBlogsByQueryParams)


module.exports = router;