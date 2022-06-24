const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")
// author model import krna hai

// functions declared to reduce repetitive code



//----------------------------------------------------------------------------------------------------------------------------------------------------

const updateBlog = async function (req, res) {
    try {

        let data = req.body
        let blogId = req.params.blogId;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ msg: "Please provide blog details" })
        }

        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        let Data = Date.now()

        const updateblog = await blogModel.findByIdAndUpdate
            ({ _id: blogId, isDeleted: false },
                { $set: { title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true, publishedAt: Data } },
                { new: true })

        console.log(updateblog)
        // blogid exist ka bar m TA se dicuss
        // if do not provide the blog id
        res.status(200).send({ status: true, data: updateblog })

    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;

        // "check" OBJECT will contain a key "isDeleted" and its value; of the blog document corresponding to the blogId
        let check = await blogModel.findOne(
            { _id: blogId },
            {
                isDeleted: 1,
                _id: 0,
            }
        );

        //CONDITIONS
        //CASE-1: blogId does not exist: validation already done in authorisation middleware

        //CASE-2: blogId exists but is deleted
        if (check && check.isDeleted) {
            return res.status(404).send({
                status: false,
                msg: "We are sorry; Given blogId does not exist", // Due to privacy concerns we are not telling that the blog is deleted
            });
        }

        //CASE-3: blogId exists but is not deleted
        else if (check && !check.isDeleted) {
            // deletion of blog using findOneAndUpdate
            await blogModel.findOneAndUpdate(
                {
                    _id: blogId,
                },
                {
                    isDeleted: true,
                    deletedAt: new Date().toLocaleString(), //deletedAt is added using Date() constructor
                }
            );
            return res.status(200).send();
        }
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error", error: err.message })
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
// module.exports.deleteBlogsQueryParams = deleteBlogsQueryParams