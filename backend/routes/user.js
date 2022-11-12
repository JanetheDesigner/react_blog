const router= require("express").Router()
const userController= require("../controllers/user")
const authMiddleware= require("../middlewares/authorization");

const isUserExist=require ("../middlewares/isUserExist");


router.post("/signup",userController.createUser)

router.post("/login",userController.signin)

router.put("/user", authMiddleware, isUserExist, userController.updateUser);


router.delete("/user/:id",authMiddleware, isUserExist, userController.deleteUserById)

router.get("/user/:id",authMiddleware, isUserExist, userController.getUserById)

router.get("/user", authMiddleware, isUserExist, userController.getUserById);


module.exports= router;