import { useEffect, useState } from "react";
import api from "../services/api";

import "../styles/Dashboard.css";
import SummaryCard from "../components/SummaryCard";

function Dashboard() {
    const [horses, setHorses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div className="dashboard">
            <h1>Welcome to Stable Ops!</h1>
            <p>You are successfully logged in.</p>

            <div className="cards">
                <SummaryCard
                    title="🐴 Horses"
                    number={horses.length}
                />
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

            <div className="card">
                <h2>Recent Tasks</h2>

                {tasks.length === 0 ? (
                    <p>No tasks found.</p>
                ) : (
                    <ul>
                        {tasks.slice(0, 5).map((task) => (
                            <li key={task.id}>
                                <strong>{task.title}</strong>
                                <br />
                                <span>{task.status}</span>
                            </li>
                         ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Dashboard;