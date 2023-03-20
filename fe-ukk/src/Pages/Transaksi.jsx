import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Transaksi extends React.Component {
    constructor() {
        super();
        this.state = {
            transaksi: [],
            meja: [],
            user: [],
            isModalOpen: false,
            token: "",
            id_transaksi: 0,
            kode_invoice: "",
            id_meja: "",
            tgl: "",
            status: "",
            id_user: "",
            userName: "",
            action: "",
            membername: "",
            username: "",
            userid: 0
    
        }
        if (localStorage.getItem('token')) {
          if (localStorage.getItem('role') === "manajer") {
            this.state.role = localStorage.getItem('role')
            this.state.token = localStorage.getItem('token')
            this.state.userName = localStorage.getItem('name')
            this.state.userid = localStorage.getItem('id_user')
            this.state.id_transaksi = localStorage.getItem('id_transaksi')
            this.state.sumTotal = localStorage.getItem('sumTotal')
          } else {
            window.alert("You are not an manajer")
            window.location = '/login'
          }
        } 
        else {
          window.location = "/login"
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
        axios.get(url)
          .then(res => {
            this.setState({
              transaksi: res.data.transaksi
            })
          })
          .catch(error => {
            console.log(error)
          })
      }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    Detail = item => {
      let id = item.id_transaksi 
      localStorage.setItem("id_transaksi", id)
      window.location = '/detailtransaksi'
  }

  handleSearch = (e) => {
    let url = "http://localhost:9000/transaksi/search/" 
    if (e.keyCode === 13) {
        let data = {
            keyword: this.state.keyword
        }
        axios.post(url, data)
            .then(res => {
                this.setState({
                    transaksi: res.data.transaksi
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }
}

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
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
                        <h3 className="mt-0 ">Histori Transaksi</h3>
                        <hr />
                        <p>Cari data Transaksi : </p>
                        <input className="form-control mb-2" type="text" name="keyword"
                           value={this.state.keyword}
                           onChange={e => this.setState({ keyword: e.target.value })}
                           onKeyUp={e => this.handleSearch(e)}
                           placeholder="Enter Name Cashier"
                       />
                        <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                        <div className="card bg-light p-3">
                            <table className="table table-transparent">
                                <thead className="text-center">
                                    <tr>
                                    <th>Kasir Name</th>
                                    <th>Tgl Pesan</th>
                                    <th>Nama Pembeli</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                {this.state.transaksi.map((item, index) => (
                                        <tr key={index}>
                                           <td>{item.user.name_user}</td>
                                            <td>{item.tgl}</td>
                                            <td>{item.nama_pelanggan}</td>
                                            <td>{
                                                    item.status === "belum_bayar" ? (<button className="btn btn-sm btn-danger">{item.status}</button>) : (<button></button>) &&
                                                        item.status === "lunas" ? (<button className="btn btn-sm btn-success">{item.status}</button>) : (<button></button>) 
                                                }</td>
                                            <td>Rp. {item.total}</td>
                                            <td>
                                              <button className="btn btn-sm btn-primary m-1" 
                                                onClick={() => this.Detail(item)}>
                                                    <span>Detail </span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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