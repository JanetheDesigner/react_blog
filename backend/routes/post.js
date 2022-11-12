const router= require("express").Router()
const controller= require("../controllers/post")
const authMiddleware= require("../middlewares/authorization");
const userExist = require("../middlewares/isUserExist")
const uploader = require("../utils/fileUploader");

router.post("/create", authMiddleware, userExist, uploader.single("image"), controller.createPost)
router.put("/update/:postId", authMiddleware, userExist, uploader.single("image"), controller.updatePostById)
router.delete("/delete/:postId", authMiddleware, userExist, controller.deletePostById)
router.get("/all", controller.getPosts)
router.get("/:postId", controller.getPost)


module.exports = router; 