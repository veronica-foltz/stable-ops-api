import { useEffect, useState } from "react";
import api from "../services/api";

import "../styles/Dashboard.css";
import SummaryCard from "../components/SummaryCard";

import { GiHorseHead } from "react-icons/gi";
import { FaUserTie, FaClipboardList } from "react-icons/fa";

import Header from "../components/Header";
import { FaSearch } from "react-icons/fa";

import Navigation from "../components/Navigation";

function Dashboard() {
    const [horses, setHorses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredHorses = horses.filter((horse) =>
        horse.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <Header />

            <Navigation />

            <div className="search-bar">
                <FaSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search horses, employees, or tasks..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />

            </div>

            <div className="cards">
                <SummaryCard
                    icon={<GiHorseHead />}
                    title="Horses"
                    number={filteredHorses.length}
                />

                <SummaryCard
                    icon={<FaUserTie />}
                    title="Employees"
                    number={filteredEmployees.length}
                />

                <SummaryCard
                    icon={<FaClipboardList />}
                    title="Tasks"
                    number={filteredTasks.length}
                />
            </div>

            <div className="card">
                <h2>Recent Horses</h2>

                {filteredHorses.length === 0 ? (
                    <p>No horses found.</p>
                ) : (
                    <ul>
                        {filteredHorses.map((horse) => (
                            <li key={horse.id}>
                                <strong>{horse.name}</strong> – {horse.breed}
                            </li>
                        ))}
                    </ul>
                    )}
            </div>

            <div className="card">
                <h2>Recent Tasks</h2>

                {filteredTasks.length === 0 ? (
                    <p>No matching tasks found.</p>
                ) : (
                    <ul>
                        {filteredTasks.slice(0, 5).map((task) => (
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