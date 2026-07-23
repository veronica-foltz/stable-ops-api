function SummaryCard({ title, number }) {
    return (
        <div className="card">
            <h2>{title}</h2>

            <div className="card-number">
                {number}
            </div>
        </div>
    );
}

export default SummaryCard;