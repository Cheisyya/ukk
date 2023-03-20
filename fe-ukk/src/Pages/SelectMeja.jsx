import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'

export default class SelectMeja extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            role : "",
            meja: []
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "kasir") {
                this.state.token = localStorage.getItem("token")
                this.state.role = localStorage.getItem('role')
            } else {
                window.alert("Anda bukan Kasir")
                window.location = "/login"
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

    getMeja = () => {
        let url = "http://localhost:9000/meja"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    meja: res.data.meja
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9000/meja/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        meja: res.data.meja
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    confirm = (item) => {
        localStorage.setItem("id_meja", JSON.stringify(item.id_meja))
        window.location = '/selectmenu'
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
                            <h3 className="mt-0">Pilih Meja</h3>
                            <hr />
                            <p>Cari Meja : </p>
                            <input className="form-control mb-2" type="text" name="keyword"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                                onKeyUp={e => this.handleSearch(e)}
                                placeholder="Enter nomer meja"
                            />
                            <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            {/* <h6>Pilih Customer</h6> */}
                            <div className="card mt-4">
                                <div className="card-title mb-0 mx-4 mt-4"><h6>Pilih Meja</h6></div><hr />
                                <table className="table table-transparent">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Nomer Meja</th>
                                            <th>Transaksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.meja.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.no_meja}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary"
                                                        onClick={() => this.confirm(item)}>
                                                        <span> </span>Confirm
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