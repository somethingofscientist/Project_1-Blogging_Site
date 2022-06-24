const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const blogs = require("../controller/blogController")
const middleware = require("../middleware/middleware")

router.get("/me", middleware.mid2, function (req, res) { res.send("My first ever api!") })

// AUTHOR CONTROLLER
router.post("/authors",authors.createAuthor)
//NEW 
router.post("/login", authors.loginAuthor)
//

// BLOG CONTROLLER
router.post("/blogs", middleware.mid1, blogs.createBlog)
router.get("/blogs", middleware.mid1, blogs.getBlogs)
router.put("/blogs/:blogId", middleware.mid1,middleware.mid2, blogs.updateBlog)
router.delete("/deleteBlog/:blogId", middleware.mid1, blogs.deleteBlog)
// router.delete("/deleteBlogsQueryParams", middleware.mid1, blogs.deleteBlogsQueryParams)



module.exports = router;