import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
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
        <div>
            <h1>Welcome to Stable Ops!</h1>
            <p>You are successfully logged in.</p>

            <h2>Horses</h2>

            {horses.length === 0 ? (
                <p>No horses found.</p>
            ) : (
                <ul>
                    {horses.map((horse) => (
                        <li key={horse.id}>
                            {horse.name} — {horse.breed}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;