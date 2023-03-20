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
const paket = model.paket

//import auth
const jwt = require("jsonwebtoken")
const SECRET_KEY = "uklframework"

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//endpoint untuk menyimpan data paket, METHOD: POST, function: create
app.post("/", (req,res) => {
    let data = {
        id_outlet: req.body.id_outlet,
        jenis: req.body.jenis,
        nama_paket: req.body.nama_paket,
        harga: req.body.harga
    }

    paket.create(data)
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

//endpoint mengupdate data paket, METHOD: PUT, function:update
app.put("/:id", (req,res) => {
    let param = {
        id_paket : req.params.id
    }
    let data = {
        id_outlet: req.body.id_outlet,
        jenis: req.body.jenis,
        nama_paket: req.body.nama_paket,
        harga: req.body.harga
    }
    paket.update(data, {where: param})
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

//endpoint menghapus data paket, METHOD: DELETE, function: destroy
app.delete("/:id", (req,res) => {
    let param = {
        id_paket : req.params.id
    }
    paket.destroy({where: param})
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


//endpoint menampilkan semua data paket, method: GET, function: findAll()
app.get("/", (req,res) => {
    paket.findAll()
        .then(result => {
            res.json({
                count: result.length,
                paket: result
            })
        })
        .catch(error => {
             res.json({
                message: error.message
            })
        })
})

// Search paket
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await paket.findAll({
        where: {
            [Op.or]: [
                {
                    id_paket: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    jenis: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_paket: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        }
    })
    res.json({
        paket: result
    })
})


module.exports = app