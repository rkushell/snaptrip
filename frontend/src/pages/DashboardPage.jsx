import { useEffect, useState } from "react";

import Navbar from "../components/navbar/Navbar";
import TripCard from "../components/cards/TripCard";

import {
  getTrips,
  createTrip,
  joinTrip,
} from "../api/tripApi";

function DashboardPage() {
  const [trips, setTrips] = useState([]);

  const [tripData, setTripData] = useState({
    title: "",
    description: "",
  });

  const [inviteCode, setInviteCode] = useState("");

  const fetchTrips = async () => {
    try {
      const data = await getTrips();

      setTrips(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async () => {
    try {
      await createTrip(tripData);

      setTripData({
        title: "",
        description: "",
      });

      fetchTrips();
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinTrip = async () => {
    try {
      await joinTrip(inviteCode);

      setInviteCode("");

      fetchTrips();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-7xl p-8">

        <h1 className="mb-10 text-5xl font-bold">
          My Trips
        </h1>

        <div className="mb-12 flex gap-4">

          <input
            placeholder="Trip title"
            value={tripData.title}
            className="rounded-2xl border p-3"
            onChange={(e) =>
              setTripData({
                ...tripData,
                title: e.target.value,
              })
            }
          />

          <input
            placeholder="Description"
            value={tripData.description}
            className="rounded-2xl border p-3"
            onChange={(e) =>
              setTripData({
                ...tripData,
                description: e.target.value,
              })
            }
          />

          <button
            onClick={handleCreateTrip}
            className="
            rounded-3xl
            bg-[#F56476]
            px-6
            text-white"
          >
            Create Trip
          </button>
        </div>

        <div className="mb-12 flex gap-4">

          <input
            placeholder="Invite code"
            value={inviteCode}
            className="rounded-2xl border p-3"
            onChange={(e) =>
              setInviteCode(e.target.value)
            }
          />

          <button
            onClick={handleJoinTrip}
            className="
            rounded-3xl
            bg-[#7A9CC6]
            px-6
            text-white"
          >
            Join Trip
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
            />
          ))}

        </div>
      </div>
    </>
  );
}

export default DashboardPage;