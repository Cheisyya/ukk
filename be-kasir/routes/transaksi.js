//import express
const express = require("express")
const app = express()
app.use(express.json())

//import model
const model = require("../models/index")
const transaksi = model.transaksi
const detail_transaksi = model.detail_transaksi
const menu = model.menu
const user = model.user
const meja = model.meja

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//POST
app.post("/", auth, (req, res) => {
    let current = new Date().toISOString().split('T')[0]
    let tgl = Date.now()
    let invoices = "INV-"
    let data = {
      tgl: current,
      kode_invoice: invoices + tgl,
      id_user: req.body.id_user,
      id_meja: req.body.id_meja,
      nama_pelanggan : req.body.nama_pelanggan,      
      status: req.body.status,
      total: req.body.total
    }
    transaksi.create(data)
        .then(result => {
            let lastID = result.id_transaksi
            console.log(lastID)
            detail = req.body.detail_transaksi
            console.log(detail)
            // perulangan untuk data detail_transaksi
            detail.forEach(element => {
                element.id_transaksi = lastID
            });
            detail_transaksi.bulkCreate(detail)
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
        })
})

//PUT
app.put("/:id",  async (req, res) => {
    let param = {
      id_transaksi: req.params.id
    }
    let data = {
      status: req.body.status,
      
    };
    
    transaksi
      .update(data, { where: param })
      .then(async (result) => {
        res.json({
          message: "Berhasil update"
        })
      })
      .catch((error) => {
        return res.json({
          message: error.message,
        });
      });
});

//DELETE
 app.delete("/:id_transaksi", auth, (req, res) => {
    // tampung parameter id_transaksi
    let parameter = {
        id_transaksi: req.params.id_transaksi
    }
  
    // delete detail transaksi
    detail_transaksi.destroy({where: parameter})
    .then(result => {
        // hapus data transaksi nya
        transaksi.destroy({where: parameter})
        .then(hasil => {
            return res.json({
                message: `Data berhasil dihapus`
            })
        })
        .catch(error => {
            return res.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return res.json({
            message: error.message
        })
    })
  })

// endpoint untuk mengubah status transaksi
app.post("/status/:id_transaksi", auth, (req, res) => {
    // kita tampung nilai status
    let data = {
        status: req.body.status
    }
  
    // kita tampung parameter
    let parameter = {
      id_transaksi: req.params.id_transaksi
    }
  
    // proses update status transaksi
    transaksi.update(data, {where: parameter})
    .then(result => {
        return res.json({
            message: `Data status berhasil diubah`
        })
    })
    .catch(error => {
        return res.json({
            message: error.message
        })
    })
  })

//GET
app.get("/",  async (req, res) => {
    let result =  await transaksi.findAll({
        include: [
          "user","meja",
          {
              model: model.detail_transaksi,
              as : "detail_transaksi",
              include: ["menu"]
          }
        ]
    })
    .then(result => {
      res.json({
          count: result.length,
          transaksi : result
      })
    })
    .catch(error => {
      res.json({
          message: error.message
    })
    })
})

app.get("/id/:id_transaksi", async (req, res) => {
    let param = { id_transaksi: req.params.id_transaksi }
    let result = await transaksi.findAll({
        where: param,
        include: [
            "user",
            "meja",
            {
                model: model.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ]
    })
    let sumTotal = await transaksi.sum('total', {
        where:
            param
    });
    res.json({
        transaksi: result,
        sumTotal: sumTotal
    })
  })

  app.get("/getByUser/:id_user",  async (req, res) => {
    let result =  await transaksi.findAll({
        where: {id_user: req.params.id_user},
        include: [
          "meja","user",
          {
              model: model.detail_transaksi,
              as : "detail_transaksi",
              include: ["menu"]
          }
        ]
    })
    .then(result => {
      res.json({
          transaksi : result
      })
    })
    .catch(error => {
      res.json({
          message: error.message
    })
    })
  })
  
  //bulanan
  app.post("/datemonth",  async (req, res) => {
    let start = new Date(req.body.start)
    let end = new Date(req.body.end)
  
    let result = await transaksi.findAll({
        where: {
            tgl: {
                [Op.between]: [
                    start, end
                ]
            }
        },
        include: [
            "user",
            "meja",
            {
                model: model.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ],
        order: [['id_transaksi', 'DESC']],
    })
    let sumTotal = await transaksi.sum('total', {
        where: {
            tgl: {
                [Op.between]: [
                    start, end
                ]
            }
        },
    });
    res.json({
        transaksi: result,
        sumTotal: sumTotal
    })
  })
  
// Search transaksi
app.post("/search",  async (req, res) => {
    let keyword = req.body.keyword
    let result = await transaksi.findAll({
        where: {
            [Op.or]: [
                {
                    '$user.name_user$': {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    status : {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_pelanggan : {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        include: [
            "user",
            "meja",
            {
                model: model.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ],
        order: [['id_transaksi', 'DESC']]
    })
    res.json({
        transaksi: result
    })
})



  module.exports = app