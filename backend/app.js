const express = require('express');
const app = express();
const cors = require("cors")
//loads data from env variable
require("dotenv").config()
//imports user route from routes folder
const userRouter = require("./routes/user")
const postRouter = require('./routes/post')
const fs = require('fs');
const path = require('path');
const loadSeedData = require("./utils/loadSeed")

const mongoose = require('mongoose');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

fs.readdir("./uploads", {encoding: "utf8"}, (err) =>{
    if(err) {
        fs.mkdirSync("./uploads", {encoding: "utf8"}, (err) =>{
         if(err) console.log("Could not create directory: "+ err.message)
         else console.log("Directory created successfully")   
        })
    }
    else console.log("Directory already exist")
});
app.use(express.static(path.join(__dirname,'uploads')));


loadSeedData()


mongoose.connect(process.env.MONGODB_URL)
    .then(_ => {
        console.log("Database connected successfully");
    }).catch(err => {
        console.error("failed to connect:", err);
    })

app.use("/auth", userRouter);
app.use("/post", postRouter)

const port = process.env.PORT || 3001
app.listen(port, () => console.log("App listening on port", port))