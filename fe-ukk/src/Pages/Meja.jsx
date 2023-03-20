import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Meja extends React.Component {
    constructor() {
        super();
        this.state = {
          meja : [],
          isModalOpen: false,
          token: "",
          id_meja: 0,
          no_meja : "",
          isModalPw: false,
          action: "" ,
          role: "",
          keyword : "",
          userName : ""
    
        }
        if (localStorage.getItem('token')) {
          if (localStorage.getItem('role') === "admin") {
            this.state.role = localStorage.getItem('role')
            this.state.token = localStorage.getItem('token')
            this.state.userName = localStorage.getItem('name_user')
          } else {
            window.alert("You are not an admin")
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

    getMeja = () => {
        let url = 'http://localhost:9000/meja/'
        axios.get(url, this.headerConfig())
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

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleAdd = () => {
        this.setState({
            action: "insert",
            no_meja : "",
            isModalOpen: true
        })
    }

    handleEdit = (item) => {
        this.setState({
            action: "update",
            id_meja: item.id_meja,
            no_meja: item.no_meja,
            isModalOpen: true
        })
    }

    handleSave = e => {
        e.preventDefault()
        let form = {
            no_meja: this.state.no_meja
        }
        let url = ""
        if (this.state.action === "insert") {
          url = "http://localhost:9000/meja/"
          axios.post(url, form, this.headerConfig())
            .then(response => {
              // window.alert(response.data.message)
              this.getMeja()
              this.handleClose()
            })
            .catch(error => console.log(error))
        } else if (this.state.action === "update") {
          url = "http://localhost:9000/meja/" + this.state.id_meja
          axios.put(url, form, this.headerConfig())
            .then(response => {
              // window.alert(response.data.message)
              this.getMeja()
              this.handleClose()
            })
            .catch(error => console.log(error))
        }
        this.setState({
          isModalOpen: false
        })
    }

    handleDrop = (id) => {
        let url = "http://localhost:9000/meja/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
            axios.delete(url)
                .then(res => {
                    console.log(res.data.message)
                    this.getMeja()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleSearch = (e) => {
        let url = "http://localhost:8080/outlet/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        outlet: res.data.outlet
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
                        <h3 className="mt-0 ">Data Meja</h3>
                        <hr />
                        <button className="btn btn-primary mb-3" onClick={() => this.handleAdd()}>
                            Add Meja
                        </button>
                        <div className="card bg-light p-3">
                            <table className="table table-transparent">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>ID</th>
                                        <th>No Meja</th>
                                        <th>Option</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.meja.map((item, index) => (
                                      <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.id_meja}</td>
                                            <td>{item.no_meja}</td>
                                            <td>
                                                <button className="btn btn-sm btn-primary m-1"
                                                    onClick={() => this.handleEdit(item)}>
                                                    <span><Edit />  </span>
                                                </button>
                                                <button className="btn btn-sm btn-danger m-1"
                                                    onClick={() => this.handleDrop(item.id_meja)}>
                                                    <span><Delete /> </span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        
                        </div>

                        <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                <Modal.Header>
                                    <Modal.Title>Form Meja</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.handleSave(e)}>
                                    <Modal.Body>
                                        <Form.Group className="mb-2" controlId="meja">
                                            <Form.Label>No Meja</Form.Label>
                                            <Form.Control type="text" name="nama" placeholder="Masukkan Nomer Mejas"
                                                value={this.state.no_meja} onChange={e => this.setState({ no_meja: e.target.value })} required />
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
        </div >
        )
    }
}