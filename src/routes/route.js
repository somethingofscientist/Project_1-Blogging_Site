const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const middleware = require("../middleware/middleware")

router.get("/me", middleware.mid1,function (req, res) {res.send("My first ever api!")}) 

router.post("/createAuthor",        authors.createAuthor)
//NEW 
router.post("/login",               authors.loginAuthor)
//
router.post("/createBlog",          middleware.mid1,authors.createBlog)
router.get("/getBlog",              middleware.mid1,authors.getBlog)
router.put("/updateBlog/:blogId",   middleware.mid1,middleware.mid2,authors.updateBlog)
router.delete("/deleteBlog/:blogId",middleware.mid1,middleware.mid2,authors.deleteBlog)
router.delete("/deleteBlogByParams",middleware.mid1,middleware.mid2,authors.deleteBlogByParams)



module.exports = router;