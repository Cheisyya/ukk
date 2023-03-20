//import
const express = require('express');
const cors = require('cors');

//implementasi
const app = express();
app.use(cors());
app.use(express.static(__dirname));

//endpoint meja
const meja = require('./routes/meja');
app.use("/meja", meja)

//endpoint user
const user = require('./routes/user');
app.use("/user", user)

//endpoint menu
const menu = require('./routes/menu');
app.use("/menu", menu)

//endpoint transaksi
const transaksi = require('./routes/transaksi');
app.use("/transaksi", transaksi)

//run server
app.listen(9000, () => {
    console.log('server run on port 9000')
})