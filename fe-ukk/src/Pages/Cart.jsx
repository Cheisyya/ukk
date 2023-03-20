import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'

export default class Cart extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            id_user: "",
            user_name: "",
            id_meja: "",
            role : "",
            meja: [],
            cart: [],   // untuk menyimpan list cart
            total: 0,   // untuk menyimpan data total belanja
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "kasir") {
                this.state.role = localStorage.getItem('role')
                this.state.user_name = localStorage.getItem('user_name')
                this.state.id_user = localStorage.getItem('id_user')
                this.state.id_meja = localStorage.getItem('id_meja')
                this.state.token = localStorage.getItem('token')
            } else {
                window.alert("Anda bukan Kasir")
                window.location = "/"
            }
            // this.state.id = localStorage.getItem("admin_id")
        } else {
            window.location = "/login"
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getMeja = () => {
        let url = "http://localhost:9000/meja/" + this.state.id_meja

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    meja: res.data.meja
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

    editItem = selectedItem => {
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }

        let index = tempCart.findIndex(it => it.id_menu === selectedItem.id_menu)
        let promptJumlah = window.prompt(`Masukkan berapa ${selectedItem.name_menu} yang akan di pesan`, selectedItem.qty)
        if (promptJumlah === null || promptJumlah === "" || promptJumlah === "0") {
            window.alert("Tidak boleh kosong")
        } else {
            tempCart[index].qty = promptJumlah
        }
        // tempCart[index].qty = promptJumlah

        // update localStorage
        localStorage.setItem("cart", JSON.stringify(tempCart))

        // refresh cart
        this.initCart()
    }

    dropItem = selectedItem => {
        if (window.confirm(`Apakah anda yakin menghapus ${selectedItem.name_menu} dari cart?`)) {
            let tempCart = []
            if (localStorage.getItem("cart") !== null) {
                tempCart = JSON.parse(localStorage.getItem("cart"))
            }

            let index = tempCart.findIndex(it => it.id_menu === selectedItem.id_menu)
            tempCart.splice(index, 1)

            // update localStorage
            localStorage.setItem("cart", JSON.stringify(tempCart))

            // refresh cart
            this.initCart()
        }
    }

    check = () => {
        window.location = '/formtransaksi'
    }

    componentDidMount = () => {
        this.initCart()
        this.getMeja()
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
                            <h3 className="mt-0 ">Data Keranjang Transaksi</h3>
                            <hr />
                            <div className="card col-12 mt-4 mb-4">
                                <h3 className="text-center mt-3">Cart List</h3>
                                <hr />
                                {this.state.cart.length === 0 ? (
                                    <div className="mb-3">
                                        <h4 className="mb-4">Cart is empty !</h4>
                                        <a href="/selectmeja" className="btn btn-primary">Add Cart</a>
                                    </div>
                                ) : (
                                <div className="card-body text-white mt-0">
                                    <div className="text-dark mb-4">
                                        <h6>Kasir : {this.state.user_name}</h6>
                                        <h6>Meja : {this.state.meja.no_meja}</h6>
                                    </div>
                                    <table className="table table-bordered mb-3">
                                        <thead>
                                            <tr>
                                                <th>Menu</th>
                                                <th>Harga</th>
                                                <th>Qty</th>
                                                <th>Total</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.cart.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name_menu}</td>
                                                    <td>Rp {item.harga}</td>
                                                    <td>{item.qty} porsi </td>
                                                    <td className="text-right">Rp {item.harga * item.qty}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-primary m-1"
                                                            onClick={() => this.editItem(item)}>
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-danger m-1"
                                                            onClick={() => this.dropItem(item)}>
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="3">Total</td>
                                                <td className="text-right">Rp {this.state.total}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-warning btn-block m-1"
                                                        onClick={this.check}
                                                        disabled={this.state.cart.length === 0}>
                                                        Checkout
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <a href="/selectmenu" className="btn btn-primary">Add Cart</a>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}