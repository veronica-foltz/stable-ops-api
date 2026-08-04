import { useEffect, useState } from "react";
import api from "../services/api";

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
        <div className="page">
            <h1>Horses</h1>

            <ul>
                {horses.map((horse) => (
                    <li key={horse.id}>
                        <strong>{horse.name}</strong> – {horse.breed}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Horses;