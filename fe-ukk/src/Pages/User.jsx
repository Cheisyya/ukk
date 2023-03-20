import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'
import { Modal, Button, Form } from 'react-bootstrap'

export default class User extends React.Component {
    constructor() {
        super();
        this.state = {
          user: [],
          isModalOpen: false,
          token: "",
          id_user: 0,
          name_user: "",
          username: "",
          password: "",
          role: "",
          search: "",
          userName: "",
          isModalPw: false,
          action: ""
    
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

    handleSearch = (e) => {
        let url = "http://localhost:9000/user/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        user: res.data.user
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleClose = () => {
        this.setState({
          isModalOpen: false,
          isModalPw: false,
        })
    }


    getUSer = () => {
        let url = "http://localhost:9000/user"

        axios.get(url)
            .then(res => {
                this.setState({
                    user: res.data.user
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    Edit = item => {
        this.setState({
            action: "update",
            id_user: item.id_user,
            name_user: item.name_user,
            username: item.username,
            password: "",
            role: item.role,
            isModalOpen: true
        })
    }

    editPassword = item => {
        this.setState({
            action: "editPassword",
            id_user : item.id_user,
            password: "",
            isModalOpen: true
        })
    }

    handleAdd = () => {
        this.setState({
          action: "insert",
          id_user: 0,
          name_user: "",
          username: "",
          password: "",
          role: "",
          isModalOpen: true
        })
    }

    saveUser = e => {
        e.preventDefault()
        let url = ""
        if (this.state.action === "insert") {
          url = "http://localhost:9000/user"
          let form = {
                id_user: this.state.id_user,
                name_user: this.state.name_user,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role,
            }
          axios.post(url, form, this.headerConfig())
            .then(response => {        
              this.getUser()
              this.handleClose()
            })        
        } else if (this.state.action === "update") {
            let form = {
                id_user: this.state.id_user,
                name_user: this.state.name_user,
                username: this.state.username,
                role: this.state.role,
            }
            url = "http://localhost:9000/user/" + this.state.id_user
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    this.getUser()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        else if  (this.state.action === "editPassword") {
            let form = {
                id_user: this.state.id_user,
                password: this.state.password,
            }
            url = "http://localhost:9000/user/password/" + this.state.id_user
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    this.getUser()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        this.setState({
            isModalOpen: false
          })
        }

    Drop = (id) => {
        let url = "http://localhost:9000/user/" + id
        if (window.confirm("Are you sure to delete this data?")) {
          axios.delete(url)
            .then(res => {
              this.getUser()
            })        
        }
    }

    componentDidMount = () => {
        this.getUSer()
    }
    
    render() {
        return (
            <div className="container-scroller">
            <Navbar />
            <div className="container-fluid page-body-wrapper">
                {this.state.role == "kasir" &&
                    <SidebarKasir />
                } {this.state.userRole == "manajer" &&
                    <SidebarManajer />
                } {this.state.role == "admin" &&
                    <SidebarAdmin className="col-span-1" />
                }
                <div className="main-panel">
                    <div className="content-wrapper">
                        <h3 className="mt-0 ">Data User</h3>
                        <hr />
                        <button className="btn btn-primary mb-3" onClick={() => this.handleAdd()}>
                            Add User
                        </button>
                        <div className="card bg-light p-3">
                            <table className="table table-transparent">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>Option</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.user.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.id_user}</td>
                                            <td>{item.name_user}</td>
                                            <td>{item.username}</td>
                                            <td>{item.role}</td>
                                            <td>{JSON.stringify(item.id_user) === localStorage.getItem("id_user") ? (
                                                <a className="btn btn-sm btn-success m-1" href="/profile">
                                                    <span>Edit </span>
                                                </a>
                                            ) : (
                                                <button className="btn btn-sm btn-primary m-1"
                                                    onClick={() => this.Edit(item)}>
                                                    <span><Edit /></span>
                                                </button>
                                            )}
                                                <button className="btn btn-sm btn-danger m-1"
                                                    onClick={() => this.Drop(item.id_user)}>
                                                    <span><Delete/></span>
                                                </button>
                                                <button className="btn btn-sm btn-secondary m-1"
                                                    onClick={() => this.editPassword(item)}>
                                                    Edit Password
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                <Modal.Header>
                                    <Modal.Title>Form User</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.saveUser(e)}>
                                    <Modal.Body>
                                        {this.state.action === "editPassword" ? (
                                            <Form.Group className="mb-2" controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" name="password" placeholder="Masukkan password"
                                                    value={this.state.password} onChange={e => this.setState({ password: e.target.value })} required />
                                            </Form.Group>
                                        ) : (<div></div>) && this.state.action !== "editPassword" ? (
                                            <div>
                                                <Form.Group className="mb-2" controlId="name_user">
                                                    <Form.Label>Nama</Form.Label>
                                                    <Form.Control type="text" name="name_user" placeholder="Masukkan nama"
                                                        value={this.state.name_user} onChange={e => this.setState({ name_user: e.target.value })} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="username">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="email" name="username" placeholder="Masukkan username"
                                                        value={this.state.username} onChange={e => this.setState({ username: e.target.value })} required />
                                                </Form.Group>
                                                {this.state.action === "insert" ? (
                                                    <Form.Group className="mb-2" controlId="password">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control type="password" name="password" placeholder="Masukkan password"
                                                            value={this.state.password} onChange={e => this.setState({ password: e.target.value })} required />
                                                    </Form.Group>
                                                ) : (
                                                    <div></div>
                                                )}
                                                <Form.Group className="mb-2" controlId="role" >
                                                    <label for="exampleSelectGender">Role</label><br />
                                                    <select type="text" name="role" class="form-control" id="exampleSelectGender" placeholder="Pilih role"
                                                        onChange={e => this.setState({ role: e.target.value })} required >
                                                        <option value={this.state.role}>{this.state.role}</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="kasir">Kasir</option>
                                                        <option value="manajer">Manajer</option>
                                                    </select>
                                                </Form.Group>
                                            </div>) : (<div></div>)}
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