const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const middleware = require("../middleware/middleware")

router.get("/me", function (req, res) {
    res.send("My first ever api!")
}) 

router.post("/createAuthor", authors.createAuthor)
router.post("/createBlogs", authors.createBlog)
router.get("/getBlog", middleware.mid1,authors.getBlog)
router.put("/updateBlog/:blogId", authors.updateBlog)
router.delete("/deleteBlog/:blogId",authors.deleteBlog)
router.delete("/deleteBlogByParams", authors.deleteBlogByParams)

//NEW
router.post("/login",authors.loginAuthor)

module.exports = router;