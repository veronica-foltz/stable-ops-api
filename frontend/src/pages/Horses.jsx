import { useEffect, useState } from "react";
import api from "../services/api";

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "../styles/Dashboard.css";

function Horses() {
    const [horses, setHorses] = useState([]);

    useEffect(() => {
        const fetchHorses = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await api.get("/horses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setHorses(response.data);
            } catch (error) {
                console.error(error.response?.data || error.message);
            }
        };

        fetchHorses();
    }, []);

    return (
    <div className="dashboard">
        <Header />
        <Navigation />

        <section className="page-section">
            <div className="page-heading">
                <div>
                    <h1>Horses</h1>
                     <p>Manage all horses in your stable.</p>
                </div>

                <button className="primary-button">
                    + Add Horse
                </button>
            </div>

            {horses.length === 0 ? (
                <p>No horses found.</p>
            ) : (
                <div className="horse-grid">
                    {horses.map((horse) => (
                        <div className="horse-card" key={horse.id}>
                            <h2>{horse.name}</h2>
                            <p>{horse.breed}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    </div>
);
}

export default Horses;