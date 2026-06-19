import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";

import {
  getTripPhotos,
  uploadPhoto,
  deletePhoto,
  createInvite,
  getTripById,
} from "../api/tripApi";

function TripPage() {
  const { tripId } = useParams();

  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [trip, setTrip] = useState(null);

  const fetchTrip = async () => {
    try {
      const data = await getTripById(tripId);

      setTrip(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPhotos = async () => {
    try {
      const data = await getTripPhotos(tripId);

      setPhotos(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchTrip();
  }, []);

  const handleUpload = async (e) => {
    try {
      await uploadPhoto(tripId, e.target.files[0]);

      fetchPhotos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await deletePhoto(photoId);

      fetchPhotos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateInvite = async () => {
    try {
      const data = await createInvite(tripId);

      setInviteCode(data.invite.code);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-8">
        <h1>Trip Page</h1>

        <button onClick={handleCreateInvite}>
          Generate Invite
        </button>

        <div>
          <p>{inviteCode}</p>

          <button
            onClick={() =>
              navigator.clipboard.writeText(inviteCode)
            }
          >
            Copy
          </button>
        </div>

        {trip && (
          <>
            <h1>{trip.title}</h1>

            <p>{trip.description}</p>

            <p>
              Members: {trip.members.length}
            </p>

            <table border="1">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {trip.members.map((member) => (
                  <tr key={member.user._id}>
                    <td>{member.user.name}</td>

                    <td>{member.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <input
          type="file"
          onChange={handleUpload}
        />

        <div>
          <input
            placeholder="Search uploader"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          {photos
            .filter((photo) =>
              photo.uploadedBy.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((photo) => (
              <div key={photo._id}>
                <img
                  src={photo.imageUrl}
                  width="250"
                  alt=""
                  onClick={() =>
                    setSelectedPhoto(photo)
                  }
                />

                <button
                  onClick={() =>
                    handleDelete(photo._id)
                  }
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>

      {selectedPhoto && (
        <div>
          <button
            onClick={() =>
              setSelectedPhoto(null)
            }
          >
            Close
          </button>

          <img
            src={selectedPhoto.imageUrl}
            width="800"
            alt=""
          />
        </div>
      )}
    </>
  );
}

export default TripPage;