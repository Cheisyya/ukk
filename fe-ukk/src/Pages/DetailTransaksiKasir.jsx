import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'

export default class DetailTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            transaksi: [],
            id_transaksi: "",
            id_user: "",
            user_name: "",
            role : "",
            total: 0
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("id_transaksi") !== null) {
                if (localStorage.getItem("role") === "manajer" || localStorage.getItem("role") === "kasir") {
                    this.state.token = localStorage.getItem('token')
                    this.state.role = localStorage.getItem('role')
                    this.state.id_transaksi = localStorage.getItem('id_transaksi')
                    this.state.id_user = localStorage.getItem('id_user')
                    this.state.user_name = localStorage.getItem('user_name')
                } else {
                    window.alert("Anda bukan Manajer / Kasir")
                    window.location = "/"
                }
            } else {
                window.alert("Klik button Detail untuk melihat detail transaksi")
                window.location = '/transaksi'
            }
        } else {
            window.location = '/login'
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getTransaksiId = () => {
        let url = "http://localhost:9000/transaksi/id/" + this.state.id_transaksi

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    transaksi: res.data.transaksi,
                    total: res.data.sumTotal,
                })
            })
            .catch(err => {
                console.log(err.message)
            })
        console.log(this.state.id_transaksi)
    }

    Cetak = id => {
        localStorage.setItem("id_transaksi", id)
        window.location = '/cetakTransaksi'
    }

    componentDidMount = () => {
        this.getTransaksiId()
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
                            <h3 className="mt-0 ">Data Transaksi</h3>
                            <hr />
                            <div className="card">
                                <div className="card-body p-4">
                                    <h3 className="text-center mb-4">Data Transaksi Blue Cafe</h3><hr />
                                    <form className="forms-sample mt-4">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">ID Transaksi</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="id_transaksi" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.kode_invoice
                                                    )
                                                })}  disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kasir</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="user" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.user.name_user
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Meja</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="meja" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.meja.no_meja
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Tanggal Transaksi</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="tgl" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.tgl
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Status Bayar</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="status" className="form-control" value={this.state.transaksi.map((item, index) => {
                                                    return (
                                                        item.status
                                                    )
                                                })} disabled />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <hr />
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h4 className="text-center">Detail Pesanan</h4>
                                    <table className="table table-bordered mb-3 mt-4">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Menu</th>
                                                <th>Harga</th>
                                                <th>Jumlah</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.transaksi.map((item, index) => (
                                                item.detail_transaksi.map((it, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{it.menu.name_menu}</td>
                                                            <td>Rp {it.menu.harga}</td>
                                                            <td>{it.qty} kg</td>
                                                            <td className="text-right">Rp {it.menu.harga * it.qty}</td>
                                                        </tr>
                                                    )
                                                })
                                            ))}
                                            {this.state.transaksi.map((item, index) => (
                                                <tr>
                                                    <td colSpan="4"><b>Total</b></td>
                                                    <td className="text-right">Rp {this.state.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <hr />
                            <div className="card mt-3 p-3">
                                <div className="d-flex justify-content-center">
                                    <a className="btn btn-dark mr-2" href="/transaksikasir">Back</a>
                                    <a href="/printtransaksi" target="_blank" class='btn btn-primary'>Cetak Transaksi</a>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
        )
    }
}