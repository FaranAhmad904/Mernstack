import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminUsers.css";

function AdminUsers() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // User currently being edited
    const [editingUser, setEditingUser] = useState(null);


    // ==========================================
    // FETCH USERS
    // ==========================================

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/users");

            setUsers(response.data.users);

        } catch (error) {

            console.error("FETCH USERS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load users"
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOAD USERS
    // ==========================================

    useEffect(() => {

        fetchUsers();

    }, []);


    // ==========================================
    // DELETE USER
    // ==========================================

    const handleDelete = async (userId, userName) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${userName}?`
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(`/users/${userId}`);

            // Remove deleted user from screen
            setUsers((currentUsers) =>
                currentUsers.filter(
                    (user) => user._id !== userId
                )
            );

            alert("User deleted successfully");

        } catch (error) {

            console.error("DELETE USER ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    };


    // ==========================================
    // UPDATE USER
    // ==========================================

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const response = await api.put(
                `/users/${editingUser._id}`,
                {
                    name: editingUser.name,
                    email: editingUser.email,
                    role: editingUser.role
                }
            );


            // Update user in current list
            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user._id === editingUser._id
                        ? response.data.user
                        : user
                )
            );


            setEditingUser(null);

            alert("User updated successfully");

        } catch (error) {

            console.error("UPDATE USER ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update user"
            );
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-users-page">

                <h1>Users</h1>

                <p>Loading users...</p>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="admin-users-page">

                <h1>Users</h1>

                <p className="users-error">
                    {error}
                </p>

                <button
                    className="users-refresh-button"
                    onClick={fetchUsers}
                >
                    Try Again
                </button>

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="admin-users-page">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="users-header">

                <div>

                    <p className="users-label">
                        ADMIN PANEL
                    </p>

                    <h1>Users</h1>

                    <span>
                        Manage registered ShopHub users
                    </span>

                </div>

                <button
                    className="users-refresh-button"
                    onClick={fetchUsers}
                >
                    Refresh
                </button>

            </div>


            {/* ==========================================
                USER COUNT
            ========================================== */}

            <div className="users-count-card">

                <div className="users-count-icon">
                    👥
                </div>

                <div>

                    <p>Total Users</p>

                    <h2>{users.length}</h2>

                </div>

            </div>


            {/* ==========================================
                USERS TABLE
            ========================================== */}

            {users.length === 0 ? (

                <div className="no-users">

                    <h2>No Users Found</h2>

                    <p>
                        Registered users will appear here.
                    </p>

                </div>

            ) : (

                <div className="users-table-container">

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Role</th>

                                <th>Registered</th>

                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {users.map((user, index) => (

                                <tr key={user._id}>

                                    <td>
                                        {index + 1}
                                    </td>

                                    <td>
                                        <strong>
                                            {user.name}
                                        </strong>
                                    </td>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                user.role === "ADMIN"
                                                    ? "role-badge admin"
                                                    : "role-badge user"
                                            }
                                        >
                                            {user.role}
                                        </span>

                                    </td>

                                    <td>

                                        {user.createdAt
                                            ? new Date(
                                                user.createdAt
                                            ).toLocaleDateString()
                                            : "N/A"}

                                    </td>


                                    {/* ==========================================
                                        ACTIONS
                                    ========================================== */}

                                    <td>

                                        <div className="user-actions">

                                            <button
                                                className="edit-user-button"
                                                onClick={() =>
                                                    setEditingUser({
                                                        ...user
                                                    })
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                className="delete-user-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        user._id,
                                                        user.name
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}


            {/* ==========================================
                EDIT USER MODAL
            ========================================== */}

            {editingUser && (

                <div className="edit-user-overlay">

                    <div className="edit-user-modal">

                        <div className="edit-user-header">

                            <div>

                                <p>
                                    ADMIN PANEL
                                </p>

                                <h2>
                                    Edit User
                                </h2>

                            </div>

                            <button
                                className="close-modal-button"
                                onClick={() =>
                                    setEditingUser(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleUpdate}>


                            {/* NAME */}

                            <div className="edit-form-group">

                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            name: e.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="edit-form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            email: e.target.value
                                        })
                                    }
                                    required
                                />

                            </div>


                            {/* ROLE */}

                            <div className="edit-form-group">

                                <label>
                                    Role
                                </label>

                                <select
                                    value={editingUser.role}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            role: e.target.value
                                        })
                                    }
                                >

                                    <option value="USER">
                                        USER
                                    </option>

                                    <option value="ADMIN">
                                        ADMIN
                                    </option>

                                </select>

                            </div>


                            {/* BUTTONS */}

                            <div className="edit-modal-buttons">

                                <button
                                    type="button"
                                    className="cancel-edit-button"
                                    onClick={() =>
                                        setEditingUser(null)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-user-button"
                                >
                                    Save Changes
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminUsers;