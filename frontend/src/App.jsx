import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Horses from "./pages/Horses";

import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/horses" element={<Horses />} />
        </Routes>
    );
}

export default App;