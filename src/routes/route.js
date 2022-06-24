const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const blogs = require("../controller/blogController")
const middleware = require("../middleware/middleware")

router.get("/test",  function (req, res) { res.send(" PROJECT 1 BLOGGING BACKEND ") })

// AUTHOR CONTROLLER
router.post("/createAuthor",authors.createAuthor)
router.post("/login", authors.loginAuthor)

// BLOG CONTROLLER
router.post("/createBlog", blogs.createBlog)
router.get("/getBlog", blogs.getBlog)
// router.put("/updateBlog/:blogId", middleware.mid1, blogs.updateBlog)
// router.delete("/deleteBlog/:blogId", middleware.mid1, blogs.deleteBlog)
// router.delete("/deleteBlogsQueryParams", middleware.mid1, blogs.deleteBlogsQueryParams)


module.exports = router;