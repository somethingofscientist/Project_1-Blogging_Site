const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const blogs = require("../controller/blogController")
const middleware = require("../middleware/middleware")

router.get("/test",  function (req, res) { res.send(" PROJECT 1 BLOGGING BACKEND ") })

// AUTHOR CONTROLLER
router.post("/authors",authors.createAuthor)
router.post("/login", authors.loginAuthor)

// BLOG CONTROLLER
router.post("/blogs", blogs.createBlog)
router.get("/blogs", blogs.getBlog)
router.delete("/blogs/:blogId",middleware.mid1,middleware.mid2,blogs.deleteBlog)

// router.delete("/deleteBlogsByQueryParams",blogs.deleteBlogsByQueryParams)
// router.put("/updateBlog/:blogId", middleware.mid1, blogs.updateBlog)


module.exports = router;