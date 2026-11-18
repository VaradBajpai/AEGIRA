function SupportCard({ resource }) {
  return (
    <div className="support-card">
      <span className="support-badge">
        {resource.category}
      </span>

      <h3>{resource.name}</h3>

      <p>
        <strong>Location:</strong>{" "}
        {resource.city}
      </p>

      <p>
        <strong>
          Service Mode:
        </strong>{" "}
        {resource.service_mode}
      </p>

      <p>
        <strong>Contact:</strong>{" "}
        {resource.contact}
      </p>

      <p>
        {resource.description}
      </p>
    </div>
  );
}

export default SupportCard;