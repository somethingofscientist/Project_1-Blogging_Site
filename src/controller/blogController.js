const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");
const { query } = require("express");


const createBlog = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide blog details" })
        }

        // destructure from params
        const { title, body, authorId, tags, category } = data;

        if (!authorId) { return res.status(400).send(" Blog Author Id is not valid") }

        if (!body) { return res.status(400).send(" Blog  Body is required") }

        if (!title) { return res.status(400).send(" Blog Title is required") }

        if (!tags) { return res.status(400).send(" tags are not valid") }

        if (!category) { return res.status(400).send(" category is required") }

        const createAuthor = await authorModel.findById(authorId)

        if (!createAuthor) { return res.status(400).send({ msg: "author is not valid" }) }

        const savedData = await blogModel.create(data)
        res.status(201).send({ data: savedData })
    }
    catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
}

const getBlog = async function (req, res) {
    try {
        let Blogs = await blogModel.find({ isDeleted: false, isPublished: true })
        console.log(Blogs)
        if (Blogs.length === 0) {
            res.status(404).send({ msg: "No data" })
        }

        let Datas = req.query
        let container = []
        container = Blogs.filter((item) => {
            if (object.keys(Datas).length == 0) {
                return true
            }
            else {
                getconditions(Datas, item)
            }

        })
        if (container.length === 0) {
            res.status(404).send({ msg: "no data" })
            return;
        }
        res.status(200).send({ status: true, data: container })
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

const getconditions = (obj, item) => {
    const arr = object.keys(obj);
    let condition = true;
    for (let key of arr) {
        if (Array.isArray(item[key])) {
            condition = condition && (item[key].includes(obj[key]))
        }
        else {
            condition = condition && (obj[key] == item[key])
        }

    }
    return condition


}




const updateBlog = async function (req, res) {
    try {
        let data = req.body
        let BlogId = req.params.blogId;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide blog details" })
        }

        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        let date1 = new Date()

        const updateZBlog = await blogModel.findOneAndUpdate({ _id: BlogId, isDeleted: false },
            {
                $set: {
                    title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true,
                    publishedAt: date1 }},{ new: true });

        const blogdata = updateZBlog ?? "BLog not found"

        res.status(200).send({ status: true, data: blogdata })

        // console.log(updateblog)
        // blogid exist ka bar m TA se dicuss
        // if do not provide the blog id

    } catch (err) {
        res.status(500).send({ msg: err.name })
    }
}


// delete blogs ===================================================
const deleteBlog = async function (req, res) {
    try {
        let BlogId = req.params.blogId
        let date = Date.now()
        let Blog = await blogModel.findById(BlogId)
        // added condition by sahil (isDeleted)
        if (!Blog) {
            return res.status(404).send({ status: false, msg: "No Data Is Found" })
        }

        let afterDeleted = await blogModel.findOneAndUpdate(
            { _id: BlogId },
            { $set: { isDeleted: true, deletedAt: date } },
            { new: true })

        return res.status(200).send({ status: true, msg: "Data Is Deleted", data: { afterDeleted } })
    }
    catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
}



//deleteby params are not get understand

const deleteBlogsQueryParams = async function (req, res) {
    try {

        let Inuser = req.authorId
        console.log(Inuser)
        let queryparms = req.query;
        console.log(queryparms)
        let data2 = new Date()
        if (Object.keys(queryparms).length==0) {

            return res.status(400).send({ status: false, msg: "Please provide key value details" })
        }

        const blogs = await blogModel.find({ ...queryparms, isDeleted: false, authorId: Inuser })

        console.log(blogs)

         if(blogs.length==0) {
           return res.status(404).send({ status:false, msg: "blogs does not exists" })
        }

        const deleteBlog = await blogModel.updateMany({ _id: { $in: blogs } }, { $set: { isDeleted: true, deletedAt: data2 } })

        res.status(200).send({status:true, msg: "Deleted" ,data:deleteBlog})
    }
    catch (err) {
        return res.status(500).send({ status: false, data: err.name})
    }
}




module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogsQueryParams = deleteBlogsQueryParams
