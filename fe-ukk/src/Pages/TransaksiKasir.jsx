import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'

export default class TransaksiKasir extends React.Component {
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
          if (localStorage.getItem('role') === "kasir" ) {
            this.state.role = localStorage.getItem('role')
            this.state.token = localStorage.getItem('token')
            this.state.userName = localStorage.getItem('name')
            this.state.username = localStorage.getItem('user')
            this.state.userid = localStorage.getItem('id_user')
            this.state.id_transaksi = localStorage.getItem('id_transaksi')
            this.state.sumTotal = localStorage.getItem('sumTotal')
          } else {
            window.alert("You are not an kasir")
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
        let url = "http://localhost:9000/transaksi/getByUser/" + this.state.userid
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
    
      getMeja = async () => {
        let url = "http://localhost:9000/meja/"
        axios.get(url)
          .then(res => {
            this.setState({
              meja: res.data.meja
            })
            console.log(this.state.meja)
          })
          .catch(error => {
            console.log(error)
          })
      }
    
      getUser = async () => {
        let url = "http://localhost:9000/user/"
        axios.get(url)
          .then(res => {
            this.setState({
              user: res.data.user
            })
            console.log(this.state.user)
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

    handleEdit = (item) => {
        this.setState({
          isModalOpen: true,
          id_transaksi: item.id_transaksi,
          status: item.status,
          action: "update",
        })
      }

      handleSave = (e) => {
        e.preventDefault()
        let form = {
          id_transaksi: this.state.id_transaksi,
          status: this.state.status,
        }
        let url = ""
        if (this.state.action === "insert") {
          url = "http://localhost:9000/transaksi/" + this.state.id_transaksi
          axios.post(url, form)
            .then(res => {
              this.getTransaksi()
              this.handleClose()
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          url = "http://localhost:9000/transaksi/" + this.state.id_transaksi
          axios.put(url, form)
            .then(res => {
              this.getTransaksi()
              this.handleClose()
            })
            .catch(err => {
              console.log(err)
            })
        }
    }
    
    Drop = (id) => {
        let url = "http://localhost:9000/transaksi/" + id
        if (window.confirm("Are you sure to delete this data?")) {
          axios.delete(url)
            .then(res => {
              console.log(res.data.message)
              this.getTransaksi()
            })
            .catch(err => {
              console.log(err.message)
            })
        }
    }

    Detail = item => {
      let id = item.id_transaksi 
      localStorage.setItem("id_transaksi", id)
      window.location = '/detailkasir'
  }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    componentDidMount = () => {
        this.getTransaksi()
        this.getMeja()
        this.getUser()
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
                        <h3 className="mt-0 ">Histori Transaksi</h3>
                        <hr />
                  
                        <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                        <div className="card bg-light p-3">
                            <table className="table table-transparent">
                                <thead className="text-center">
                                    <tr>
                                    <th>Kode Invoice</th>
                                    <th>Nama Pembeli</th>
                                    <th>Tgl</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                {this.state.transaksi.map((item, index) => (
                                        <tr key={index}>
                                          <td>{item.kode_invoice}</td>
                                            <td>{item.nama_pelanggan}</td>
                                            <td>{item.tgl}</td>
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
                                                <button className="btn btn-sm btn-primary m-1"
                                                    onClick={() => this.handleEdit(item)}>
                                                    <span>Edit </span>
                                                </button>
                                                <button className="btn btn-sm btn-danger m-1"
                                                    onClick={() => this.Drop(item.id_transaksi)}>
                                                    <span>Delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        
                        </div>

                        <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                            <Modal.Header>
                                <Modal.Title>Data Transaction</Modal.Title>
                            </Modal.Header>
                                <Form onSubmit={e => this.handleSave(e)}>
                                    <Modal.Body>
                                        <Form.Group className="mb-2" controlId="gender" >
                                            <label for="exampleSelectGender">Status </label><br />
                                            <select type="text" name="status" class="form-control" id="exampleSelectGender" placeholder="update status"
                                                onChange={e => this.setState({ status: e.target.value })} required >
                                                <option>-- update status ---</option>
                                                <option value="lunas">Telah Membayar</option>
                                            </select>
                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="dark" onClick={this.handleClose}>
                                            Close
                                        </Button>
                                    <Button variant="primary" type="submit">
                                        Save
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}