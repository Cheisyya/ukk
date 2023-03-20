import React from 'react'
import Home from '@mui/icons-material/Home'
import Money from '@mui/icons-material/AttachMoney'
import Outlet from '@mui/icons-material/Storefront'
import Print from '@mui/icons-material/Print'

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
                            <a className="nav-link" href="/outlet">
                                <Outlet sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Outlet</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/transaksikasir">
                                <Money sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Histori Transaksi</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/laporan">
                                <Print sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Generate Laporan</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}