import React from 'react'
import axios from 'axios'
import {ReactToPrint} from 'react-to-print';
import { Modal, Button, Form } from 'react-bootstrap'


export default class CetakTransaksi extends React.Component {
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
            // customer: "",
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("id_transaksi") !== null) {
                if ( localStorage.getItem("role") === "kasir") {
                    this.state.token = localStorage.getItem('token')
                    this.state.role = localStorage.getItem('role')
                    this.state.id_transaksi = localStorage.getItem('id_transaksi')
                    this.state.id_user = localStorage.getItem('id_user')
                    this.state.user_name = localStorage.getItem('user_name')
                } else {
                    window.alert("Anda bukan Kasir")
                    window.location = "/"
                }
            } else {
                window.alert("Klik button Detail untuk melihat detail transaksi")
                window.location = '/transaksikasir'
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

    print(){
        window.print();
    }

    componentDidMount = () => {
        this.getTransaksiId()
    }


    render() {
        return (
            
                <div>
            <div className="container p-5" ref={el => (this.componentRef = el)}>

                <h2 className="text-center mb-3">Berlynn Cafe</h2>
                <h3 className="text-center mb-5">Data Transaksi Cafe</h3>
                <hr />
                <form className="forms-sample mt-5 mb-4">
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">ID Transaksi</label>
                        <div className="col-sm-9">
                            <input type="text" name="id_transaksi" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.kode_invoice
                                )
                             })}  disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Meja</label>
                        <div className="col-sm-9">
                            <input type="text" name="meja" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.meja.no_meja
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Kasir</label>
                        <div className="col-sm-9">
                            <input type="text" name="user" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.user.name_user
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Customer</label>
                        <div className="col-sm-9">
                            <input type="text" name="nama_pelanggan" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.nama_pelanggan
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
                        <label className="col-sm-3 col-form-label">Tanggal Transaksi</label>
                        <div className="col-sm-9">
                            <input type="text" name="tgl" className="form-control" value={this.state.transaksi.map((item, index) => {
                                return (
                                    item.tgl
                                )
                            })} disabled />
                        </div>
                    </div>
                    <div className="form-group row mb-0">
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
                <hr /><br />
                <h4 className="text-center">Detail Pemesanan</h4>
                <table className="table table-bordered mb-3 mt-5">
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
                        {/* {this.state.transaksi.map((item, index) => ( */}
                        <tr>
                            <td colSpan="4"><b>Total</b></td>
                            <td className="text-right">Rp {this.state.total}</td>
                        </tr>
                        {/* ))} */}
                    </tbody>
                </table>
                </div>
                
                </div>
        )
    }
}