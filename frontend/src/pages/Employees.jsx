import { useEffect, useState } from "react";
import api from "../services/api";

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "../styles/Dashboard.css";

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [newEmployee, setNewEmployee] = useState({
        name: "",
        role: "",
    });

    async function fetchEmployees() {
        try {
            const token = localStorage.getItem("access_token");

            const response = await api.get("/employees", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEmployees(response.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function handleSaveEmployee() {
        if (!newEmployee.name.trim() || !newEmployee.role.trim()) {
            alert("Please enter both a name and role.");
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            if (editingEmployee) {
                await api.put(
                    `/employees/${editingEmployee.id}`,
                    newEmployee,
                    { headers }
                );
            } else {
                await api.post("/employees", newEmployee, { headers });
            }

            await fetchEmployees();

            setSuccessMessage(
                editingEmployee
                    ? "Employee updated successfully!"
                    : "Employee added successfully!"
            );

            setNewEmployee({
                name: "",
                role: "",
            });

            setEditingEmployee(null);
            setShowModal(false);

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    async function handleDeleteEmployee(employeeId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            await api.delete(`/employees/${employeeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await fetchEmployees();
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Header />
            <Navigation />

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            <section className="page-section">
                <div className="page-heading">
                    
                        <h1>Employees</h1>
                        <p>
                            Manage all {employees.length} employees in your stable.
                        </p>
                    

                    <button
                        className="primary-button"
                        onClick={() => {
                            setEditingEmployee(null);
                            setNewEmployee({
                                name: "",
                                role: "",
                            });
                            setShowModal(true);
                        }}
                    >
                        + Add Employee
                    </button>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredEmployees.length === 0 ? (
                    <div className="empty-state">
                        <h3>No employees found</h3>
                        <p>Try a different search or add an employee.</p>
                    </div>
                ) : (
                    <div className="management-grid">
                        {filteredEmployees.map((employee) => (
                            <div
                                className="management-card"
                                key={employee.id}
                            >
                                <h2>{employee.name}</h2>
                                <p>{employee.role}</p>

                                <div className="card-actions">
                                    <button
                                        className="secondary-button"
                                        onClick={() => {
                                            setEditingEmployee(employee);

                                            setNewEmployee({
                                                name: employee.name,
                                                role: employee.role,
                                            });

                                            setShowModal(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="danger-button"
                                        onClick={() =>
                                            handleDeleteEmployee(employee.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>
                            {editingEmployee
                                ? "Edit Employee"
                                : "Add Employee"}
                        </h2>

                        <div className="form-group">
                            <label htmlFor="employee-name">
                                Name
                            </label>

                            <input
                                id="employee-name"
                                type="text"
                                value={newEmployee.name}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="employee-role">
                                Role
                            </label>

                            <input
                                id="employee-role"
                                type="text"
                                value={newEmployee.role}
                                onChange={(e) =>
                                    setNewEmployee({
                                        ...newEmployee,
                                        role: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                className="secondary-button"
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingEmployee(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="primary-button"
                                onClick={handleSaveEmployee}
                                disabled={
                                    !newEmployee.name.trim() ||
                                    !newEmployee.role.trim()
                                }
                            >
                                {editingEmployee
                                    ? "Save Changes"
                                    : "Save Employee"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Employees;