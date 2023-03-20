//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const model = require('../models/index');
const user = model.user

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// import auth 
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "PastiLulus"

//CREATE (check)
app.post("/", auth, (req,res) => {
    let data = {
        name_user : req.body.name_user,
        role : req.body.role,
        username : req.body.username,
        password : md5(req.body.password)
    }

    user.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//UPDATE (check)
app.put("/:id", auth, (req,res) => {
    let param = {
        id_user : req.params.id
    }
    let data = {
        name_user : req.body.name_user,
        role : req.body.role,
        username : req.body.username,
    }
    user.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//DELETE (check)
app.delete("/:id", (req,res) => {
    let param = {
        id_user : req.params.id
    }
    user.destroy({where: param})
        .then(result => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//GET (check)
app.get("/", (req,res) => {
    user.findAll()
        .then(result => {
            res.json({
                count: result.length,
                user: result
            })
        })
        .catch(error => {
             res.json({
                message: error.message
            })
        })
})

//UPDATE PASSWORD (check)
app.put("/password/:id", auth, (req, res) => {
    let param = {
        id_user: req.params.id
    }
    let data = {
        password: md5(req.body.password)
    }
    user.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//belum (check)
app.get("/id/:id", auth, (req, res) => {
    let param = {
        id_user: req.params.id
    }
    user.findOne({ where: param })
        .then(user => {
            res.json({
                user: user
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})


// // GET ADMIN by ID, METHOD: GET, FUNCTION: findOne
// app.get("/id/:id", async (req, res) => {
//     let param = {
//         id_user: req.params.id
//     }
//     let result = await admin.findOne({
//     })
//     res.json({
//         admin: result
//     })
// })

//LOGIN (check)
app.post("/auth", async (req, res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    // mencari data admin yang username dan passwordnya sama dengan inputan
    let result = await user.findOne({ where: data })
    if (result) {
        // jika ditemukan, set payload data
        let payload = JSON.stringify({
            id_user: result.id_user,
            name_user: result.name_user,
            username: result.username
        })
        // generate token based on payload and secret key
        let token = jwt.sign(payload, SECRET_KEY)
        // set output 
        res.json({
            logged: true,
            data: result,
            token: token
        })
    }
    else {
        // jike tidak ditemukan 
        res.json({
            logged: false,
            message: "invalid username or password"
        })
    }
})

module.exports = app