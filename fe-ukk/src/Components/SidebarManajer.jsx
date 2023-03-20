import React from 'react'
import Home from '@mui/icons-material/Home'
import Money from '@mui/icons-material/AttachMoney'
import Outlet from '@mui/icons-material/Storefront'
import Print from '@mui/icons-material/Print'
import Filter from '@mui/icons-material/FilterList';

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
                            <a className="nav-link" href="/transaksi">
                                <Money sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Histori Transaksi</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="collapse" href="#cart" aria-expanded="false" aria-controls="auth">
                                <Filter sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Filtering</span>
                                <i className="menu-arrow"></i>
                            </a>
                            <div className="collapse" id="cart">
                                <ul className="nav flex-column sub-menu">
                                    <li className="nav-item"> <a className="nav-link" href="/filterbulanan">Bulanan</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}