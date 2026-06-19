import { Link } from "react-router-dom";

function TripCard({ trip }) {
  return (
    <Link
      to={`/trip/${trip._id}`}
      className="
      rounded-3xl
      bg-white
      p-6
      shadow-md
      transition
      hover:scale-[1.02]"
    >
      <div className="mb-4 h-48 rounded-2xl bg-[#7A9CC6]" />

      <h2 className="text-2xl font-bold">
        {trip.title}
      </h2>

      <p className="mt-2 text-[#69585F]">
        {trip.members.length} members
      </p>
    </Link>
  );
}

export default TripCard;