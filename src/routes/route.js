const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")

router.get("/me", function (req, res) {
    res.send("My first ever api!")
}) 



router.post("/createAuthor", authors.createAuthor)
router.post("/createBlogs", authors.createBlog)
router.post("/login",authors.loginAuthor)

router.get("/getBlog", authors.getBlog)
router.put("/updateBlog/:blogId", authors.updateBlog)
router.delete("/deleteBlog/:blogId",authors.deleteBlog)
router.delete("/deleteBlogByParams", authors.deleteBlogByParams)

module.exports = router;