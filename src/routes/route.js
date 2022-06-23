const express = require('express');
const router = express.Router();
const authorController=require("../controllers/authorController")
const blogController=require("../controllers/blogController")
const mid=require("../middlewares/auth")

//----------------------------------------------API USED IN THE PROJECT---------------------------------------------------

//----------------------------------------------CREATE AUTHOR API----------------------------------------------------
router.post('/authors',authorController.createAuthor)

//----------------------------------------------CREATE BLOG API-----------------------------------------------------
router.post('/blogs',mid.authenticate, blogController.createBlog)

//----------------------------------------------GET BLOG API-------------------------------------------------------
router.get('/blogs', mid.authenticate, blogController.getBlog)

//--------------------------------------------UPDATE BLOG API-------------------------------------------------------
router.put('/blogs/:blogId',mid.authenticate, mid.authorise, blogController.updateBlog)

//--------------------------------------------DELETE BLOG API-------------------------------------------------------
router.delete('/blogs/:blogId',mid.authenticate, blogController.deleteById)
//--------------------------------------------DELETE BLOG by filters API-------------------------------------------------------
router.delete('/blogs',mid.authenticate, blogController.deleteBlog)

//---------------------------------------------AUTHOR LOGIN API------------------------------------------------------
router.post('/login',blogController.authorLogin)

module.exports = router;