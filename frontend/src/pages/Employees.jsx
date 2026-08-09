import { useEffect, useState } from "react";
import api from "../services/api";

const [employees, setEmployees] = useState([]);
const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
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
            console.error(error);
        }
    }

    fetchEmployees();
}, []);

return (
    <div className="page-heading">
        <h1>Employees</h1>

        {employees.map((employee) => (
            <div key={employee.id}>
                {employee.name}
            </div>
        ))}
    </div>
);