import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'

export default class SelectMenu extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            menu: [],
            role : "",
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("id_meja") !== null) {
                if (localStorage.getItem("role") === "kasir") {
                    this.state.token = localStorage.getItem("token")
                    this.state.role = localStorage.getItem("role")
                } else {
                    window.alert("Anda bukan Kasir")
                    window.location = "/"
                }
            } else {
                window.alert("Pilih meja terlebih dahulu")
                window.location = '/selectmeja'
            }
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

    getMenu = () => {
        let url = "http://localhost:9000/menu"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    menu: res.data.menu
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9000/menu/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        menu: res.data.menu
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    addToCart = (selectedItem) => {
        // membuat sebuah variabel untuk menampung cart sementara
        let tempCart = []

        // cek elsistensi dari data cart pada localstorage
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
            // JSON.parse() digunakan untuk mengonversi dari string -> array object
        }

        // cek data yang dipilih user ke keranjang belanja
        let existItem = tempCart.find(item => item.id_menu === selectedItem.id_menu)
        if (existItem) {
            // jika item yang dipilih ada pada keranjang belanja
            window.alert(`Anda telah memilih menu ${selectedItem.name_menu}`)
        }
        else {
            // user diminta memasukkan jumlah item yang dibeli
            let promptJumlah = window.prompt(`Input qty ${selectedItem.name_menu} yang akan di pesan`, "")
            if (promptJumlah === null || promptJumlah === "" || promptJumlah === "0") {
                window.alert("Tidak boleh kosong")
            } else {
               // jika user memasukkan jumlah item yang dibeli
               // menambahkan properti "jumlahBeli" pada item yang dipilih
               selectedItem.qty = promptJumlah
               // masukkan item yang dipilih ke dalam cart
               tempCart.push(selectedItem)
               // simpan array tempCart ke localStorage
               localStorage.setItem("cart", JSON.stringify(tempCart))
            }
        }
    }

    componentDidMount = () => {
        this.getMenu()
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
                            <h3 className="mt-0">Pilih Menu </h3>
                            <hr />
                            <p>Cari menu : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter jenis menu / nama menu/ Jenis menu"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <div className="row mt-2">
                                {this.state.menu.map((item, index) => {
                                    return (
                                        <div className="col-3 my-2" key={index}>
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <img src={"http://localhost:9000/image/menu/" + item.gambar} className="card-img-top" alt={item.nama_menu} />
                                                    <h5 className="card-title">{item.name_menu}</h5><hr />
                                                    <p className="card-text">{item.deskripsi}</p>
                                                    <b className="card-text">Price : Rp {item.harga}</b>
                                                    <div className="row d-flex justify-content-center mt-4">
                                                        <button className="btn btn-sm btn-primary w-100 mx-3" onClick={() => this.addToCart(item)}><span></span>Confirm</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                      
                    </div>
                </div>
            </div>
        )
    }
}