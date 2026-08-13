function Header() {
    const username = localStorage.getItem("username");

    return (
        <header className="header">
            <div className="logo">
                Stable Ops
            </div>

            <div className="user">
                {username || "Guest"}
            </div>
        </header>
    );
}

export default Header;