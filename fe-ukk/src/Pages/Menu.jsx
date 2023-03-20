import React from 'react'
import Navbar from '../Components/Navbar'
import SidebarAdmin from '../Components/SidebarAdmin';
import SidebarKasir from '../Components/SidebarKasir';
import SidebarManajer from '../Components/SidebarManajer';
import axios from 'axios'
import Delete from '@mui/icons-material/DeleteOutline'
import Edit from '@mui/icons-material/EditOutlined'
import { Modal, Button, Form } from 'react-bootstrap'

export default class Menu extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            menu: [],
            isModalOpen: false,
            id_menu: "",
            name_menu: "",
            jenis: "",
            deskripsi: "",
            gambar: null,
            harga : "",
            action: "",
            keyword : "",
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "admin") {
                this.state.token = localStorage.getItem("token")
                this.state.role = localStorage.getItem('role')
            } else {
                window.alert("You are not an admin")
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

    getMenu = () => {
        let url = "http://localhost:9000/menu"

        axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    menu: res.data.menu
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

    handleFile = (e) => {
        this.setState({
            gambar: e.target.files[0]
        })
    }

    handleAdd = () => {
        this.setState({
            isModalOpen: true,
            name_menu: "",
            jenis : "",
            deskripsi : "",
            gambar: null,
            harga: "",
            action: "insert"
        })
    }

    handleEdit = (item) => {
        this.setState({
            isModalOpen: true,
            id_menu: item.id_menu,
            name_menu: item.name_menu,
            jenis: item.jenis,
            deskripsi : item.deskripsi,
            gambar: item.gambar,
            harga : item.harga,
            action: "update"
        })
    }

    handleSearch = (e) => {
        let url = "http://localhost:9000/menu/search"
        if (e.keyCode === 13) {
            let data = {
                keyword: this.state.keyword
            }
            axios.post(url, data)
                .then(res => {
                    this.setState({
                        menu: res.data.menu
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleSave = (e) => {
        e.preventDefault()
        let form = new FormData()
        form.append("name_menu", this.state.name_menu)
        form.append("jenis", this.state.jenis)
        form.append("deskripsi", this.state.deskripsi)
        form.append("gambar", this.state.gambar)
        form.append("harga", this.state.harga)

        let url = ""
        if (this.state.action === "insert") {
            url = "http://localhost:9000/menu"
            axios.post(url, form)
                .then(res => {
                    this.getMenu()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        else if (this.state.action === "update") {
            url = "http://localhost:9000/menu/" + this.state.id_menu
            axios.put(url, form)
                .then(res => {
                    this.getMenu()
                    this.handleClose()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }

    handleDrop = (id) => {
        let url = "http://localhost:9000/menu/" + id
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
            axios.delete(url)
                .then(res => {
                    console.log(res.data.message)
                    this.getMenu()
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
        this.getMenu()
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
                            <h3 className="mt-0">Data Menu</h3>
                            <hr />
                                <p>Cari data Menu : </p>
                                <input className="form-control mb-2" type="text" name="keyword"
                                    value={this.state.keyword}
                                    onChange={e => this.setState({ keyword: e.target.value })}
                                    onKeyUp={e => this.handleSearch(e)}
                                    placeholder="Enter to search by jenis menu "
                                />
                        <p className="text-danger mb-4">*Klik enter untuk mencari data</p>
                            <button className="btn btn-primary mb-3" onClick={() => this.handleAdd()}>
                                Add Menu
                            </button>
                            <div className="row mt-2">

                                {this.state.menu.map((item, index) => {
                                    return (
                                        <div className="col-3 my-2" key={index}>
                                            <div className="card h-100">
                                                <img src={"http://localhost:9000/image/menu/" + item.gambar} className="card-img-top" alt={item.name_menu} />
                                                <div className="card-body">
                                                    <h5 className="card-title">{item.name_menu}</h5><hr />
                                                    <p className="card-text">{item.deskripsi}</p>
                                                    <b className="card-text">Price : Rp {item.harga}</b>
                                                    <div className="row d-flex justify-content-center mt-4">
                                                        <button className="btn btn-sm btn-primary  w-100 mx-3" onClick={() => this.handleEdit(item)}><span><Edit /> </span>Edit</button>
                                                        <button className="btn btn-sm btn-danger  w-100 mx-3" onClick={() => this.handleDrop(item.id_menu)}><span><Delete /> </span>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                                {/* <Modal.Header closeButton> */}
                                <Modal.Header>
                                    <Modal.Title>Form Package</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={e => this.handleSave(e)}>
                                    <Modal.Body>
                                        <Form.Group className="mb-2" controlId="name_menu">
                                            <Form.Label>Nama Menu</Form.Label>
                                            <Form.Control type="text" name="name_menu" placeholder="Enter the name menu"
                                                value={this.state.name_menu} onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="jenis" >
                                            <label for="exampleSelectGender">Jenis</label><br />
                                                <select type="text" name="jenis" class="form-control" id="exampleSelectGender" placeholder="Pilih Jenis"
                                                    onChange={e => this.setState({ jenis : e.target.value })} required >
                                                    <option>--- pilih jenis ---</option>
                                                    <option value="makanan">Makanan</option>
                                                    <option value="minuman">Minuman</option>
                                                </select>
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="deskripsi">
                                            <Form.Label>Deskripsi</Form.Label>
                                            <Form.Control type="text" name="deskripsi" placeholder="Enter the deskripsi"
                                                value={this.state.deskripsi} onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="gambar">
                                            <Form.Label>Gambar</Form.Label>
                                            <Form.Control type="file" name="gambar" placeholder="Enter the gambar"
                                                onChange={this.handleFile} />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="harga">
                                            <Form.Label>Harga</Form.Label>
                                            <Form.Control type="number" name="harga" placeholder="Enter the harga"
                                                value={this.state.harga} onChange={this.handleChange} />
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