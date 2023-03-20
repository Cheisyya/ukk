import React from 'react'
import Home from '@mui/icons-material/Home'

import Cart from '@mui/icons-material/ShoppingCart'
import Money from '@mui/icons-material/AttachMoney'


export default class SidebarAdmin extends React.Component {
    render() {
        return (
            <div>
                {/* <!-- partial -->
                      <!-- partial:partials/_sidebar.html --> */}
                <nav className="sidebar sidebar-offcanvas" id="sidebar">
                    <ul className="nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/">
                                <Home sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Dashboard</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="collapse" href="#cart" aria-expanded="false" aria-controls="auth">
                                <Cart sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Keranjang</span>
                                <i className="menu-arrow"></i>
                            </a>
                            <div className="collapse" id="cart">
                                <ul className="nav flex-column sub-menu">
                                    <li className="nav-item"> <a className="nav-link" href="/selectmeja">Add Cart</a></li>
                                    <li className="nav-item"> <a className="nav-link" href="/cart">Cart List</a></li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/transaksikasir">
                                <Money sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Histori Transaksi</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}