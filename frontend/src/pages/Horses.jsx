import { useEffect, useState } from "react";
import api from "../services/api";

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import "../styles/Dashboard.css";

function Horses() {
    const [horses, setHorses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingHorse, setEditingHorse] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    
    const [newHorse, setNewHorse] = useState({
        name: "",
        breed: "",
    });

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

    async function handleAddHorse() {
        if (!newHorse.name.trim() || !newHorse.breed.trim()) {
            alert("Please enter both a horse name and breed.");
            return;
        }

        try {
            const token = localStorage.getItem("access_token");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            if (editingHorse) {
                await api.put(`/horses/${editingHorse.id}`, newHorse, {
                    headers,
                });
            } else {
                await api.post("/horses", newHorse, {
                    headers,
                });
            }

            const response = await api.get("/horses", {
                headers,
            });

            setHorses(response.data);

            setSuccessMessage(
                editingHorse
                    ? "Horse updated successfully!"
                    : "Horse added successfully!"
            );

            setNewHorse({
                name: "",
                breed: "",
            });

            setEditingHorse(null);
            setShowModal(false);

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    async function handleDeleteHorse(horseId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this horse?"
        );

        if (!confirmed) {
            return;
        }
        
        try {
            const token = localStorage.getItem("access_token");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await api.delete(`/horses/${horseId}`, {
                headers,
            });

            const response = await api.get("/horses", {
                headers,
        });

            setHorses(response.data);

        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    const filteredHorses = horses.filter((horse) =>
        horse.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                <div>
                    <h1>Horses</h1>
                     <p>Manage all {horses.length} horses in your stable.</p>

                     <p className="results-count">
                        {searchTerm
                            ? `Showing ${filteredHorses.length} of ${horses.length} horses`
                            : `Showing ${horses.length} horses`}
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowModal(true)}
                >
                    + Add Horse
                </button>
            </div>

            {filteredHorses.length === 0 ? (
                <div className="empty-state">
                    <h3>No horses found</h3>
                    <p>Try a different search or add a new horse.</p>
                </div>
            ) : (
                <>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search horses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="horse-grid">
                    {filteredHorses.map((horse) => (
                        <div className="horse-card" key={horse.id}>
                            <h2>{horse.name}</h2>
                            <p>{horse.breed}</p>

                            <div className="card-actions">
                                <button
                                    className="secondary-button"
                                    onClick={() => {
                                        setEditingHorse(horse);

                                        setNewHorse({
                                            name: horse.name,
                                            breed: horse.breed,
                                        });

                                        setShowModal(true);
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="danger-button"
                                    onClick={() => handleDeleteHorse(horse.id)}
                                >
                                    Delete
                                    </button>
                                </div>
                        </div>
                    ))}
                </div>
                </>
            )}
        </section>

        {showModal && (
            <div className="modal">
                <div className="modal-content">
                    <h2>{editingHorse ? "Edit Horse" : "Add Horse"}</h2>

                    <div className="form-group">
                        <label htmlFor="horse-name">Name</label>
                        <input
                            id="horse-name"
                            type="text"
                            value={newHorse.name}
                            onChange={(e) =>
                                setNewHorse({
                                    ...newHorse,
                                    name: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddHorse();
                                }
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="horse-breed">Breed</label>
                        <input
                            id="horse-breed"
                            type="text"
                            value={newHorse.breed}
                            onChange={(e) =>
                                setNewHorse({
                                    ...newHorse,
                                    breed: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddHorse();
                                }
                            }}
                        />
                    </div>
                <div className="modal-actions">
                    <button
                        className="secondary-button"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary-button"
                        onClick={handleAddHorse}
                        disabled={
                            !newHorse.name.trim() ||
                            !newHorse.breed.trim()
                        }
                    >
                        {editingHorse ? "Save Changes" : "Save Horse"}
                    </button>
                </div>
                </div>
            </div>
        )}    

    </div>
);
}

export default Horses;