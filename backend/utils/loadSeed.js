const userModel = require("../models/user")
const bcrypt = require("bcryptjs")

module.exports = () => {
const seeds = [{
    firstName: "Jane",
    lastName: "Empress", 
    gender: "Female",
    email: "jenny4luve@gmail.com",
    password: "chinwe123",
    role: "superadmin"
},
{
    firstName: "Remilekun",
    lastName: "Elijah", 
    gender: "Male",
    email: "remilekun.elijah@innovantics.com",
    password: "12345",
    role: "admin"
}]

seeds.map(uploadSeedsToDatabase)

function uploadSeedsToDatabase (data) {
    data.password = bcrypt.hashSync(data.password)
    userModel.create(data).then(data => {
        console.log("created", data.role)
    }).catch(err=>{
        if(err.code === 11000) console.log("Admin already created")
        else console.log("An error occured", err.message)
    })
}

}