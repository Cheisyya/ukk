import React from 'react'
import Home from '@mui/icons-material/Home'
import Person from '@mui/icons-material/Group'
import Table from '@mui/icons-material/TableRestaurant';
import Food from '@mui/icons-material/Fastfood';

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
                            <a className="nav-link" href="/user">
                                <Person sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">User</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/meja">
                                <Table sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Meja</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/menu">
                                <Food sx={{ fontSize: 20, marginInline: 1.5 }} />
                                <span className="menu-title">Menu </span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}