import { Link } from "react-router-dom";

function Navigation() {
    return (
        <nav className="navigation">
            <Link to="/">Dashboard</Link>
            <Link to="/horses">Horses</Link>
            <Link to="/employees">Employees</Link>
            <Link to="/tasks">Tasks</Link>
        </nav>
    );
}

export default Navigation;