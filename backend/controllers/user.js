const UserModel = require("../models/user");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.createUser = async function (req, res) {
    const newUser = req.body;
    try {

        const existingUser = await UserModel.findOne({
            email: newUser.email
        });
        //checks if user exist
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exist"
            })
        } else {
            //if not hash their password
            const hash = bcrypt.hashSync(newUser.password);

            newUser.password = hash;

            const user = await UserModel.create(newUser)
            console.log("Created User Data", user);
            res.status(201).json({
                success: true,
                message: "User created successfully"
            })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

exports.signin = async function (req, res) {
    const user = req.body;
    console.log(user);
    try {
        const existingUser = await UserModel.findOne({ email: user.email })

        if (existingUser) {
            //compare the user's password
            const isPasswordMatch = bcrypt.compareSync(user.password, existingUser.password)
            //if password match
            if (isPasswordMatch === true) {
                const tokenPayload = {
                    id: existingUser._id,
                    email: existingUser.email
                }
                //generate auth token
                const token = jwt.sign(tokenPayload, process.env.SECRET_KEY, { expiresIn: '3d' })
                res.status(200).json({ success: true, message: "User logged in successfully", token })
            } else {
                //respond to the client
                res.status(404).json({ success: false, message: "Email or password is incorrect" })
            }
        }
        else {
            //respond to the client
            res.status(404).json({ success: false, message: "User not found" })
        }
    } catch (error) {
        console.error(error);
        //respond to the client
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

exports.updateUser = async function (req, res) {
    console.log(req.body);
    if(req.body.password) {
          //if not hash their password
          const hash = bcrypt.hashSync(req.body.password);
          req.body.password = hash;
    }

    //gets the id from res.locals
    const userId = res.locals.id;
    //data from req body
    const dataToUpdate = req.body;

    try {
        //find and update the user's data
        const updateData = await UserModel.findByIdAndUpdate(userId, dataToUpdate, { new: true })

        console.log(updateData);

        //checks if data was updated
        if (updateData) {
            res.status(201).json({ success: true, message: "Profile updated successfully", data: updateData })
        } else {
            res.status(500).json({ success: false, message: "Failed to update profile,please try again" })
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: "Something went wrong", error })
    }
}

exports.deleteUserById = async (req, res) => {
    //gets the user id from req.param
    const id = req.params.id;
    try {
        console.log(id);
        //find and delete the user
        const deleteUser = await UserModel.findByIdAndDelete(id)
        //if deleted
        if (deleteUser) {
            //responds to the client
            res.status(200).json({ success: false, message: "User deleted successfully" })
        }
        //else
        else {
            //respond to the client
            res.status(404).json({ success: false, message: "User not found" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong", error })
    }
}

exports.getUserById = async (req, res) => {
    const id = req.params.id || res.locals.id;
    try {
        //finds the user
        const user = await UserModel.findById(id)
        // if found
        if (user) {
            //responds to the client
            res.status(200).json({ success: true, message: "User retrieved successfully", data: user })
        }
        else {
            //responds to the client
            res.status(404).json({ success: false, message: "User not found" })
        }
    } catch (error) {
        console.log(error);
        //responds to the client
        res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}