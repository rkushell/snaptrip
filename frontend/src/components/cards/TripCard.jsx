import { Link } from "react-router-dom";

/* Color palettes for album covers — Apple-ish gradients */
const ALBUM_GRADIENTS = [
  "linear-gradient(135deg, #E8F2FF 0%, #B8D4FF 100%)",
  "linear-gradient(135deg, #F0FFF4 0%, #BBEED0 100%)",
  "linear-gradient(135deg, #FFF5E8 0%, #FFDCB0 100%)",
  "linear-gradient(135deg, #F5F0FF 0%, #DECDFF 100%)",
  "linear-gradient(135deg, #FFF0F3 0%, #FFD6DD 100%)",
  "linear-gradient(135deg, #F0F8FF 0%, #BAE3FF 100%)",
];

function getGradient(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return ALBUM_GRADIENTS[Math.abs(hash) % ALBUM_GRADIENTS.length];
}

function TripCard({ trip }) {
  const gradient = getGradient(trip._id || trip.title);
  const initials = trip.title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      to={`/trip/${trip._id}`}
      id={`trip-card-${trip._id}`}
      className="album-card"
    >
      {/* Album Cover */}
      <div
        className="album-cover"
        style={{ background: gradient }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Folder icon */}
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0,122,255,0.45)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>

          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "rgba(0,122,255,0.7)",
              letterSpacing: "-0.02em",
            }}
          >
            {initials}
          </span>
        </div>
      </div>

      {/* Album Info */}
      <div className="album-info">
        <div className="album-title">{trip.title}</div>
        <div className="album-meta">
          {trip.members?.length ?? 0}{" "}
          {trip.members?.length === 1 ? "member" : "members"}
          {trip.description && ` · ${trip.description}`}
        </div>
      </div>
    </Link>
  );
}

export default TripCard;