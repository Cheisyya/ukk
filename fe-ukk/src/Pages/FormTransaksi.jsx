import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'

export default class FormTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            id_user: "",
            user_name: "",
            id_meja: "",
            meja_no: "",
            cart: [],   // untuk menyimpan list cart
            total: 0,   // untuk menyimpan data total belanja
            status: "",
            role : "",
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("id_meja") !== null && localStorage.getItem("cart") !== null) {
                if (localStorage.getItem("role") === "kasir") {
                    this.state.token = localStorage.getItem("token")
                    this.state.id_user = localStorage.getItem("id_user")
                    this.state.id_meja = localStorage.getItem("id_meja")
                    this.state.role = localStorage.getItem("role")
                } else {
                    window.alert("Anda bukan Kasir")
                    window.location = "/"
                }
            } else {
                window.alert("Cart kosong")
                window.location = '/selectmeja'
            }
        }
        else {
            window.location = '/login'
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getUserId = () => {
        let url = "http://localhost:9000/user/id/" + this.state.id_user

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    user_name: res.data.user.name_user,
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMejaId = () => {
        let url = "http://localhost:9000/meja/" + this.state.id_meja

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    meja_no: res.data.meja.no_meja
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    initCart = () => {
        // memanggil data cart pada localStorage
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }
        // memanggil data user pada localStorage
        let userName = localStorage.getItem("user")
        // kalkulasi total harga
        let totalHarga = 0;
        tempCart.map(item => {
            totalHarga += (item.harga*item.qty)
        })
        // memasukkan data cart, user, dan total harga pada state
        this.setState({
            cart: tempCart,
            user: userName,
            total: totalHarga
        })
    }

    checkOut = (e) => {
        e.preventDefault()
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }
        let data = {
            id_meja: this.state.id_meja,
            id_user: this.state.id_user,
            nama_pelanggan: this.state.nama_pelanggan,
            status: this.state.status,
            total: this.state.total,
            detail_transaksi: tempCart
        }
        let url = "http://localhost:9000/transaksi"
        axios.post(url, data, this.headerConfig())
            .then(res => {
                // clear cart
                window.alert(res.data.message)
                localStorage.removeItem("cart")
                localStorage.removeItem("id_meja")
                window.location = "/transaksikasir"
            })
            .catch(error => {
                if (error.res) {
                    if (error.res.status) {
                        window.alert(error.res.data.message)
                    }
                } else {
                    console.log(error);
                }
            })
    }

    componentDidMount = () => {
        this.initCart()
        this.getUserId()
        this.getMejaId()
    }

    render() {
        return (
            <div className="container-scroller">
            <Navbar />
            <div className="container-fluid page-body-wrapper">
            {this.state.role == "kasir" &&
                <SidebarKasir />
                }
                
                  {this.state.userRole == "manajer" &&
                <SidebarManajer />
                }
                {this.state.role == "admin" &&
                <SidebarAdmin className="col-span-1" />
                }
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <div className="card">
                                <div className="card-body p-4">
                                    <h3 className="text-center mb-4">From Transaksi Laundry</h3><hr />
                                    <form className="forms-sample mt-4" onSubmit={e => this.checkOut(e)}>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kasir</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="id_user" className="form-control" value={this.state.user_name} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Meja</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="id_meja" className="form-control" value={this.state.meja_no} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Tanggal Transaksi</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="tgl" className="form-control" value={new Date().toLocaleDateString('en-CA')} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Nama Pelanggan</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="nama_pelanggan" className="form-control" placeholder="Masukkan Nama Pelanggan"
                                                onChange={e => this.setState({ nama_pelanggan : e.target.value })}  required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Status Bayar</label>
                                            <div className="col-sm-9">
                                            <select type="text" name="status" class="form-control" id="exampleSelectGender" placeholder="Pilih Status Bayar"
                                                    onChange={e => this.setState({ status : e.target.value })} required >
                                                    <option>--- Status Pembayaran ---</option>
                                                    <option value="lunas">Bayar Sekarang</option>
                                                    <option value="belum_bayar">Bayar Nanti</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <a className="btn btn-dark mr-2" href="/cart">Back</a>
                                            <button className="btn btn-primary" type="submit">Continue</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <hr />
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h4 className="text-center">Detail Transaksi</h4>
                                    <table className="table table-bordered mb-3 mt-4">
                                        <thead>
                                            <tr>
                                                <th>Menu</th>
                                                <th>Harga</th>
                                                <th>Qty</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.cart.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name_menu}</td>
                                                    <td>Rp {item.harga}</td>
                                                    <td>{item.qty} kg</td>
                                                    <td className="text-right">Rp {item.harga * item.qty}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="3">Total</td>
                                                <td className="text-right">Rp {this.state.total}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}