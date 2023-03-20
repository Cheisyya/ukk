import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarOwner from '../Components/SidebarOwner';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'

export default class Dashboard extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            UserName: "",
            userRole: "",
            userCount: 0,
            mejaCount: 0,
            menuCount: 0,
            transaksiCount: 0
        }
        // cek di local storage apakah ada token (sudah login)
        if (localStorage.getItem('token')) {
            this.state.token = localStorage.getItem('token')
            this.state.UserName = localStorage.getItem('name_user')
            this.state.userRole = localStorage.getItem('role')
        }
        // jika tidak ada token (belum login)
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

    getUSer = () => {
        let url = "http://localhost:9000/user"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    userCount: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMeja = () => {
        let url = "http://localhost:9000/meja"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    mejaCount: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getMenu = () => {
        let url = "http://localhost:9000/menu"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    menuCount: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    getTransaksi = () => {
        let url = "http://localhost:9000/transaksi"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    transaksiCount: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    componentDidMount = () => {
        this.getUSer()
        this.getMeja()
        this.getMenu()
        this.getTransaksi()
    }

    render() {
        return (
            <div className="container-scroller">
            <Navbar />
            <div className="container-fluid page-body-wrapper">
            {this.state.userRole == "kasir" &&
                <SidebarKasir />
                }
                {this.state.userRole == "owner" &&
                <SidebarOwner />
                }
                 {this.state.userRole == "manajer" &&
                <SidebarManajer />
                }
                {this.state.userRole == "admin" &&
                <SidebarAdmin className="col-span-1" />
                }
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="row">
                            <div className="col-md-12 grid-margin">
                                <div className="row">
                                    <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                                        <h3 className="font-weight-bold">Hi! Welcome {this.state.userRole} {this.state.UserName} </h3>
                                        <h6 className="font-weight-normal mb-0">All systems are running smoothly!</h6>
                                    </div>
                                    <div className="col-12 col-xl-4">
                                        <div className="justify-content-end d-flex">
                                            <div className="dropdown flex-md-grow-1 flex-xl-grow-0">
                                                <button className="btn btn-sm btn-light bg-white" type="button" id="dropdownMenuDate2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                    {/* <i className="mdi mdi-calendar"></i>Outlet : {this.state.outlet.nama}, {this.state.outlet.alamat} */}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 grid-margin stretch-card">
                                <div className="card tale-bg">
                                    <div className="card-people mt-auto">
                                        <img src="images/dashboard/people.svg" alt="people" />
                                        <div className="weather-info">
                                            <div className="d-flex">
                                                <div>
                                                    <h2 className="mb-0 font-weight-normal"><i className="icon-sun mr-2"></i>28<sup>C</sup></h2>
                                                </div>
                                                <div className="ml-2">
                                                    {/* <h4 className="location font-weight-normal">{this.state.outlet.alamat}</h4> */}
                                                    <h6 className="font-weight-normal">Indonesia</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 grid-margin transparent">
                                <div className="row">
                                    <div className="col-md-6 mb-4 stretch-card transparent">
                                        <div className="card card-tale">
                                            <div className="card-body">
                                                <p className="mb-4">User Total</p>
                                                <div className="row">
                                                    <div className="col-3"></div>
                                                    <div className="col-9"><p className="fs-30 mb-3">{this.state.userCount}</p></div>
                                                </div>
                                                <p>100%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4 stretch-card transparent">
                                        <div className="card card-dark-blue">
                                            <div className="card-body">
                                                <p className="mb-4">Meja Total</p>
                                                <div className="row">
                                                    <div className="col-3"></div>
                                                    <div className="col-9"><p className="fs-30 mb-3">{this.state.mejaCount}</p></div>
                                                </div>
                                                <p>100%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-4 mb-lg-0 stretch-card transparent">
                                        <div className="card card-light-blue">
                                            <div className="card-body">
                                                <p className="mb-4">Berlynn Menu Total</p>
                                                <div className="row">
                                                    <div className="col-3"></div>
                                                    <div className="col-9"><p className="fs-30 mb-3">{this.state.menuCount}</p></div>
                                                </div>
                                                <p>100%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 stretch-card transparent">
                                        <div className="card card-light-danger">
                                            <div className="card-body">
                                                <p className="mb-4">Transaksi Total</p>
                                                <div className="row">
                                                    <div className="col-3"></div>
                                                    <div className="col-9"><p className="fs-30 mb-3">{this.state.transaksiCount}</p></div>
                                                </div> 
                                                <p>100%</p>
                                            </div>
                                        </div>
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