import { useEffect, useState } from "react";
import api from "../services/api";

import "../styles/Dashboard.css";

function Dashboard() {
    const [horses, setHorses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const headers = {
                
                    Authorization: `Bearer ${token}`,
                };

                const [horsesResponse, employeesResponse, tasksResponse] =
                    await Promise.all([
                        api.get("/horses", { headers }),
                        api.get("/employees", { headers }),
                        api.get("/tasks", { headers }),
                    ]);

                setHorses(horsesResponse.data);
                setEmployees(employeesResponse.data);
                setTasks(tasksResponse.data);
            } catch (error) {
                console.error(error.response?.data || error.message);
            }
        };

        fetchDashboardData();

    return (
        <div className="dashboard">
            <h1>Welcome to Stable Ops!</h1>
            <p>You are successfully logged in.</p>

            <div className="cards">
                <div className="card">
                    <h2>🐴 Horses</h2>
                    <div className="card-number">
                        {horses.length}
                    </div>
                </div>
            </div>

            <div className="card">
                <h2>Employees</h2>
                    <div className="card-number">
                        {employees.length}
                    </div>
            </div>

            <div className="card">
                <h2>Tasks</h2>
                    <div className="card-number">
                        {tasks.length}
                    </div>
            </div>

            
            <div className="card">
                <h2>Recent Horses</h2>

                {horses.length === 0 ? (
                    <p>No horses found.</p>
                ) : (
                    <ul>
                        {horses.map((horse) => (
                            <li key={horse.id}>
                                <strong>{horse.name}</strong> – {horse.breed}
                            </li>
                        ))}
                    </ul>
                    )}
            </div>
        </div>
    );
}

export default Dashboard;