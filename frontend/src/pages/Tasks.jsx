import { useEffect, useState } from "react";
import api from "../services/api";

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "../styles/Dashboard.css";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [horses, setHorses] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [newTask, setNewTask] = useState({
        title: "",
        status: "Pending",
        horse_id: "",
        employee_id: "",
    });

    async function fetchTaskPageData() {
        try {
            const token = localStorage.getItem("access_token");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [
                tasksResponse,
                horsesResponse,
                employeesResponse,
            ] = await Promise.all([
                api.get("/tasks", { headers }),
                api.get("/horses", { headers }),
                api.get("/employees", { headers }),
            ]);

            setTasks(tasksResponse.data);
            setHorses(horsesResponse.data);
            setEmployees(employeesResponse.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    useEffect(() => {
        fetchTaskPageData();
    }, []);

    async function handleSaveTask() {
        if (
            !newTask.title.trim() ||
            !newTask.status ||
            !newTask.horse_id ||
            !newTask.employee_id
        ) {
            alert("Please complete all task fields.");
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const taskData = {
                title: newTask.title,
                status: newTask.status,
                horse_id: Number(newTask.horse_id),
                employee_id: Number(newTask.employee_id),
            };

            if (editingTask) {
                await api.put(
                    `/tasks/${editingTask.id}`,
                    taskData,
                    { headers }
                );
            } else {
                await api.post(
                    "/tasks",
                    taskData,
                    { headers }
                );
            }

            await fetchTaskPageData();

            setSuccessMessage(
                editingTask
                    ? "Task updated successfully!"
                    : "Task added successfully!"
            );

            setNewTask({
                title: "",
                status: "Pending",
                horse_id: "",
                employee_id: "",
            });

            setEditingTask(null);
            setShowModal(false);

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    async function handleDeleteTask(taskId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            await api.delete(`/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await fetchTaskPageData();
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    const filteredTasks = tasks.filter((task) =>
        task.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    function getHorseName(horseId) {
        const horse = horses.find(
            (horse) => horse.id === horseId
        );

        return horse ? horse.name : "Unknown horse";
    }

    function getEmployeeName(employeeId) {
        const employee = employees.find(
            (employee) => employee.id === employeeId
        );

        return employee
            ? employee.name
            : "Unassigned";
    }

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
                    
                        <h1>Tasks</h1>
                        <p>
                            Manage all {tasks.length} stable tasks.
                        </p>
                    

                    <button
                        className="primary-button"
                        onClick={() => {
                            setEditingTask(null);

                            setNewTask({
                                title: "",
                                status: "Pending",
                                horse_id: "",
                                employee_id: "",
                            });

                            setShowModal(true);
                        }}
                    >
                        + Add Task
                    </button>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>

                {filteredTasks.length === 0 ? (
                    <div className="empty-state">
                        <h3>No tasks found</h3>
                        <p>
                            Try a different search or add a task.
                        </p>
                    </div>
                ) : (
                    <div className="management-grid">
                        {filteredTasks.map((task) => (
                            <div
                                className="management-card"
                                key={task.id}
                            >
                                <h2>{task.title}</h2>

                                <p>
                                    Status: <strong>{task.status}</strong>
                                </p>

                                <p>
                                    Horse: {getHorseName(task.horse_id)}
                                </p>

                                <p>
                                    Employee:{" "}
                                    {getEmployeeName(task.employee_id)}
                                </p>

                                <div className="card-actions">
                                    <button
                                        className="secondary-button"
                                        onClick={() => {
                                            setEditingTask(task);

                                            setNewTask({
                                                title: task.title,
                                                status: task.status,
                                                horse_id:
                                                    task.horse_id,
                                                employee_id:
                                                    task.employee_id,
                                            });

                                            setShowModal(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="danger-button"
                                        onClick={() =>
                                            handleDeleteTask(task.id)
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
                            {editingTask
                                ? "Edit Task"
                                : "Add Task"}
                        </h2>

                        <div className="form-group">
                            <label htmlFor="task-title">
                                Title
                            </label>

                            <input
                                id="task-title"
                                type="text"
                                value={newTask.title}
                                onChange={(e) =>
                                    setNewTask({
                                        ...newTask,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="task-status">
                                Status
                            </label>

                            <select
                                id="task-status"
                                value={newTask.status}
                                onChange={(e) =>
                                    setNewTask({
                                        ...newTask,
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="task-horse">
                                Horse
                            </label>

                            <select
                                id="task-horse"
                                value={newTask.horse_id}
                                onChange={(e) =>
                                    setNewTask({
                                        ...newTask,
                                        horse_id: e.target.value,
                                    })
                                }
                            >
                                <option value="">
                                    Select a horse
                                </option>

                                {horses.map((horse) => (
                                    <option
                                        key={horse.id}
                                        value={horse.id}
                                    >
                                        {horse.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="task-employee">
                                Employee
                            </label>

                            <select
                                id="task-employee"
                                value={newTask.employee_id}
                                onChange={(e) =>
                                    setNewTask({
                                        ...newTask,
                                        employee_id:
                                            e.target.value,
                                    })
                                }
                            >
                                <option value="">
                                    Select an employee
                                </option>

                                {employees.map((employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="secondary-button"
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingTask(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="primary-button"
                                onClick={handleSaveTask}
                                disabled={
                                    !newTask.title.trim() ||
                                    !newTask.horse_id ||
                                    !newTask.employee_id
                                }
                            >
                                {editingTask
                                    ? "Save Changes"
                                    : "Save Task"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;