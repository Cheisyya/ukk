import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Profile extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            id_user: "",
            user: [],
            name_user: "",
            username: "",
            password: "",
            role: "",
            isModalOpen: false
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
            this.state.id_user = localStorage.getItem("id_user")
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


    getUserId = () => {
        let url = "http://localhost:9000/user/id/" + this.state.id_user

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    user: res.data.user,
                    name_user: res.data.user.name_user,
                    username: res.data.user.username,
                    password: "",
                    role: res.data.user.role,
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    saveUser = e => {
        if (localStorage.getItem("role") !== "admin") {
            e.preventDefault()
            window.alert("Tidak dapat mengubah profile")
        } else {
            e.preventDefault()
            let form = {
                id_user: this.state.id_user,
                name_user: this.state.name_user,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role,
            }
            let url = "http://localhost:9000/user/" + this.state.id_user
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    this.getUserId()
                })
                .catch(error => console.log(error))

            this.setState({
                isModalOpen: false
            })
            localStorage.setItem("user_name", this.state.name_user)
            localStorage.setItem("role", this.state.role)
        }
    }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    componentDidMount() {
        this.getUserId()
        
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
                            <h3 className="mt-0 ">User Profile</h3>
                            <hr />
                            <div class="container rounded bg-white">
                                <div class="row">
                                    <div class="col-md-4 border-right">
                                        <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                                            <img class="rounded-circle mt-5" width="150" height="150" src="https://drh.co.id/images/profile.png" />
                                            <h5 class="mt-4">{this.state.user.name_user}</h5>
                                            {/* <span class="text-black-50 mt-1">{this.state.user.username}</span> */}
                                            <p class="text-black-50 mt-1">{this.state.user.username} | {this.state.user.role} </p>
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="p-3 py-5">
                                            <div class="d-flex justify-content-between align-items-center mb-3">
                                                <h4 class="text-right">Profile Settings</h4>
                                            </div>
                                            <Form onSubmit={e => this.saveUser(e)}>
                                                <Form.Group className="mb-2" controlId="name_user">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" name="name_user" placeholder="Enter your name"
                                                        value={this.state.name_user} onChange={this.handleChange} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="username">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="text" name="username" placeholder="Enter your username"
                                                        value={this.state.username} onChange={this.handleChange} required />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="role">
                                                    <label for="exampleSelectGender">Role</label><br />
                                                    <select type="text" name="role" class="form-control" id="exampleSelectGender"
                                                        onChange={this.handleChange} required >
                                                        <option value={this.state.role}>{this.state.role}</option>
                                                        <option value="Admin">Admin</option>
                                                        <option value="Kasir">Kasir</option>
                                                        <option value="Manajer">Manajer</option>
                                                    </select>
                                                </Form.Group>
                                                <Button variant="primary mt-2" type="submit">
                                                    Save Profile
                                                </Button>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
        )
    }
}