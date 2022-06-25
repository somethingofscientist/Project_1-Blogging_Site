const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const blogs = require("../controller/blogController")
const middleware = require("../middleware/middleware")

router.get("/test",  function (req, res) { res.send(" PROJECT 1 BLOGGING BACKEND ") })

// AUTHOR CONTROLLER
router.post("/authors",authors.createAuthor)
//NEW 
router.post("/login", authors.loginAuthor)

// BLOG CONTROLLER
router.post("/blogs", blogs.createBlog)
router.get("/blogs", middleware.mid1, blogs.getBlog)
router.put("/blogs/:blogId", middleware.mid1,middleware.mid2, blogs.updateBlog)
router.delete("/deleteBlog/:blogId", middleware.mid1, blogs.deleteBlog)
// router.delete("/deleteBlogsQueryParams", middleware.mid1, blogs.deleteBlogsQueryParams)

// router.delete("/deleteBlogsByQueryParams",blogs.deleteBlogsByQueryParams)
// router.put("/updateBlog/:blogId", middleware.mid1, blogs.updateBlog)


module.exports = router;