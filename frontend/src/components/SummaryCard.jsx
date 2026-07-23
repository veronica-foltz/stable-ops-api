function SummaryCard({ icon, title, number }) {
    return (
        <div className="card summary-card">
            <div className="summary-icon">
                {icon}
            </div>

            <h2>{title}</h2>

            <div className="card-number">
                {number}
            </div>
        </div>
    );
}

export default SummaryCard;