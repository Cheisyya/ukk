import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'

export default class Laporan extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            transaksi: [],
            id_transaksi: "",
            user: "",
            tgl: "",
            meja : "",
            menu : "",
            nama_pelanggan : "",
            status: "",
            detail_transaksi: [],
            isModalOpen: false,
            start: "",
            end: "",
            total: 0,
            role : ""
        }
        if (localStorage.getItem('token')) {
            if (localStorage.getItem("role") === "manajer") {
                this.state.token = localStorage.getItem('token')
                this.state.role = localStorage.getItem('role')
            } else {
                window.alert("You are not an admin")
                window.location = "/"
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

    getTransaksi = () => {
        let url = "http://localhost:9000/transaksi/" 

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
    }

    betweenDate = (e) => {
        e.preventDefault()
        if (this.state.start === "" && this.state.end === "") {
            this.getTransaksi()
        } else {
            let url = "http://localhost:9000/transaksi/datemonth/" 
            let data = {
                start: this.state.start, 
                end: this.state.end
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        transaksi: res.data.transaksi,
                        total: res.data.sumTotal
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }

    }

    componentDidMount = () => {
        this.getTransaksi()
        
    }

    render() {
        return (
            <div className="container-scroller">
            <Navbar />
            <div className="container-fluid page-body-wrapper">
            {this.state.role == "kasir" &&
                <SidebarKasir />
                }
                
                  {this.state.role == "manajer" &&
                <SidebarManajer />
                }
                {this.state.role == "admin" &&
                <SidebarAdmin className="col-span-1" />
                }
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <h3 className="mt-0 ">Data Transaksi</h3>
                            <hr />
                            <h6 className="mb-3">Filter transaksi by date :</h6>
                            <form onSubmit={(e) => this.betweenDate(e)}>
                                <div className="row mb-5">
                                    <div className="col-3">
                                        <div className="d-flex">
                                            <label className="mt-2">Start</label>
                                            <input type="date" name="start" className="form-control mx-3"
                                                value={this.state.start}
                                                onChange={e => this.setState({ start: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="d-flex">
                                            <label className="mt-2">End</label>
                                            <input type="date" name="end" className="form-control mx-3"
                                                value={this.state.end}
                                                onChange={e => this.setState({ end: e.target.value })}/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                    <button className="btn btn-primary" type="submit">Set</button>
                                    </div>
                                </div>
                            </form>
                            <div className="card bg-light p-3">
                            <table className="table table-transparent">
                            <thead className="text-center">
                                        <tr>
                                            <th>No.</th>
                                            <th>ID</th>
                                            <th>Admin</th>
                                            <th>Customer</th>
                                            <th>Tgl Transaksi</th>
                                            <th>Status</th>
                                            <th>Paket</th>
                                            <th>Harga</th>
                                            <th>Qty</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {this.state.transaksi.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.kode_invoice}</td>
                                                    <td>{item.user.name_user}</td>
                                                    <td>{item.nama_pelanggan}</td>
                                                    <td>{item.tgl}</td>
                                                    <td>{item.status}</td>
                                                    <td><ol>{item.detail_transaksi.map((item, index) => (
                                                        <li>{item.menu.name_menu}</li>
                                                    ))}</ol>
                                                    </td>
                                                    <td>{item.detail_transaksi.map((item, index) => (
                                                        <p>{item.menu.harga}</p>
                                                    ))}
                                                    </td>
                                                    <td>{item.detail_transaksi.map((item, index) => (
                                                        <p>{item.qty}</p>
                                                    ))}
                                                    </td>
                                                    <td>{item.detail_transaksi.map((item, index) => (
                                                        <p>{item.menu.harga * item.qty}</p>
                                                    ))}
                                                    </td>
                                                    
                                                    
                                                </tr>
                                            )
                                        })}
                                        <tr  >
                                            <td colSpan="9">Total Pendapatan</td>
                                            <td>{this.state.total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            
                        </div>
                     
                    </div>
                </div>
            </div>
        )
    }
}