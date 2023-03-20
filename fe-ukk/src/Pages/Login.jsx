import React from 'react'
import axios from 'axios'
import {Link} from "react-router-dom"

export default class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: ""
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLogin = (e) => {
        e.preventDefault()
        let data = {
            username: this.state.username,
            password: this.state.password
        }
        let url = "http://localhost:9000/user/auth"
        axios.post(url, data)
            .then(res => {
                if (res.data.logged) {
                    let id_user = res.data.data.id_user
                    let user_name = res.data.data.name_user
                    let role = res.data.data.role
                    let token = res.data.token
                    localStorage.setItem("id_user", id_user)
                    localStorage.setItem("user_name", user_name)
                    localStorage.setItem("role", role)
                    localStorage.setItem("token", token)
                    window.location = '/'
                }
                else {
                    window.alert(res.data.message)
                }
            })
    }

    render() {
        return (
            <div class="container-scroller">
                <div class="container-fluid page-body-wrapper full-page-wrapper">
                    <div class="content-wrapper d-flex align-items-center auth px-0">
                        <div class="row w-100 mx-0">
                            <div class="col-lg-4 mx-auto">
                                <div class="auth-form-light text-left py-5 px-4 px-sm-5">
                                    <div class="brand-logo">
                                        
                                    </div>
                                    <h4>Hello! let's get started</h4>
                                    <h6 class="font-weight-light">Sign in to continue.</h6>
                                    <form class="pt-3" onSubmit={(e) => this.handleLogin(e)}>
                                        <div class="form-group">
                                            <input type="email" name="username" class="form-control form-control-lg" id="exampleInputEmail1" placeholder="Username"
                                                value={this.state.username} onChange={this.handleChange} required/>
                                        </div>
                                        <div class="form-group">
                                            <input type="password" name="password" class="form-control form-control-lg" id="exampleInputPassword1" placeholder="Password"
                                                value={this.state.password} onChange={this.handleChange} required/>
                                        </div>
                                        <div class="mt-3">
                                            <button class="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" type="submit">SIGN IN</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}