

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
const meja = model.meja

// import auth 
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "PastiLulus"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//CREATE
app.post("/", auth, (req,res) => {
    let data = {
        no_meja : req.body.no_meja
    }

    meja.create(data)
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

//by id
app.get("/:id_meja", auth, (req, res) => {
    meja.findOne({ where: { id_meja: req.params.id_meja } })
        .then(result => {
            res.json({
                meja: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})


//UPDATE
app.put("/:id", auth, (req,res) => {
    let param = {
        id_meja : req.params.id
    }
    let data = {
        no_meja : req.body.no_meja
    }
    meja.update(data, {where: param})
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

//DELETE
app.delete("/:id", (req,res) => {
    let param = {
        id_meja : req.params.id
    }
    meja.destroy({where: param})
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

//GET
app.get("/",auth, (req,res) => {
    meja.findAll()
        .then(result => {
            res.json({
                count: result.length,
                meja: result
            })
        })
        .catch(error => {
             res.json({
                message: error.message
            })
        })
})

//Search (check)
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await meja.findAll({
        where: {
            [Op.or]: [
                {
                    no_meja: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        }
    })
    res.json({
        meja: result
    })
})


module.exports = app;