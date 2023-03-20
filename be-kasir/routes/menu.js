const express = require("express");
const app = express();
app.use(express.json())

const multer = require("multer")
const path = require("path")
const fs = require("fs")    // untuk membaca file sistem (dimana file itu)

// import models
const model = require('../models/index')
const menu = model.menu

// import sequelize op
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// import auth 
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "PastiLulus"


// config storage image, membuat konfigurasi untuk menyimpan foto (dimana foto yang diinsert akan disimpan)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image/menu")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
// cb(callback) setiap dijalankan call lagi / berulang

let upload = multer({ storage: storage })   // yang diganti yang ada dalam cb

//POST (check)
app.post("/", upload.single("gambar"), (req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    }
    else {
        let data = {
            name_menu: req.body.name_menu,
            jenis: req.body.jenis,
            deskripsi: req.body.deskripsi,
            gambar: req.file.filename,
            harga: req.body.harga
        }
        menu.create(data)
            .then(result => {
                res.json({
                    message: "Data has been inserted"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    }
})

//GET auth (check)
app.get("/",auth,  (req, res) => {
    menu.findAll()
        .then(result => {
            res.json({
                count: result.length,
                menu: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//PUT
app.put("/:id", upload.single("gambar"),  (req, res) => {
    let param = {
        id_menu: req.params.id
    }
    let data = {
        name_menu: req.body.name_menu,
            jenis: req.body.jenis,
            deskripsi: req.body.deskripsi,
            harga: req.body.harga
    }
    if (req.file) {
        // get data by id
        const row = menu.findOne({ where: param })
            .then(result => {
                let oldFileName = result.gambar

                // delete old file
                let dir = path.join(__dirname, "../image/menu", oldFileName)
                fs.unlink(dir, err => console.log(err))
            })
            .catch(error => {
                console.log(error.message)
            })

        // set new filename
        data.gambar = req.file.filename
    }
    menu.update(data, { where: param })
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

//DELETE
// async = asyncronus, untuk menjalankan data secara tdk berurutan (bisa ada yg dilewati) 
// await = untuk menunggu proses, tambahkan await di proses yg tdk boleh dilewati
app.delete("/:id", async (req, res) => {
    try {
        let param = { id_menu: req.params.id }
        let result = await menu.findOne({ where: param })
        let oldFileName = result.gambar

        // delete old file
        let dir = path.join(__dirname, "../image/menu", oldFileName)
        fs.unlink(dir, err => console.log(err))

        // delete data
        menu.destroy({ where: param })
            .then(result => {
                res.json({
                    message: "Data has been deleted",
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

//Search (check)
app.post("/search", async (req, res) => {
    let keyword = req.body.keyword
    let result = await menu.findAll({
        where: {
            [Op.or]: [
                {
                    name_menu: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    jenis: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        }
    })
    res.json({
        menu: result
    })
})

module.exports = app;