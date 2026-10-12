import { NavLink, Outlet } from "react-router-dom";

import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Plus,
    Store
} from "lucide-react";

import "../styles/AdminLayout.css";

function AdminLayout() {
    return (
        <div className="admin-layout">

            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <aside className="admin-sidebar">

                {/* LOGO */}
                <div className="admin-logo">
                    <div className="admin-logo-icon">
                        <Store size={21} strokeWidth={2.2} />
                    </div>

                    <div>
                        <h2>ShopHub</h2>
                        <span>Admin Panel</span>
                    </div>
                </div>


                {/* NAVIGATION */}
                <nav className="admin-navigation">

                    <p className="sidebar-section-title">
                        MAIN
                    </p>

                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <LayoutDashboard
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Dashboard</span>
                    </NavLink>


                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <Package
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Products</span>
                    </NavLink>


                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <ShoppingCart
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Orders</span>
                    </NavLink>


                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <Users
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Users</span>
                    </NavLink>


                    <p className="sidebar-section-title second">
                        MANAGEMENT
                    </p>


                    <NavLink
                        to="/admin/products/new"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <Plus
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Add Product</span>
                    </NavLink>


                    <NavLink
                        to="/admin/reports"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <BarChart3
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Reports</span>
                    </NavLink>

                </nav>


                {/* SIDEBAR FOOTER */}
                <div className="sidebar-footer">
                    <div className="sidebar-status-dot"></div>

                    <span>System Online</span>
                </div>

            </aside>


            {/* ==========================================
                MAIN CONTENT
            ========================================== */}

            <main className="admin-main">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;