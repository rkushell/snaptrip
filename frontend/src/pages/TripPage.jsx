import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";

import {
  getTripPhotos,
  uploadPhoto,
  deletePhoto,
  createInvite,
  getTripById,
  downloadAlbum,
} from "../api/tripApi";

function TripPage() {
  const { tripId } = useParams();

  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [trip, setTrip] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");

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

  const handleDownloadAlbum = async () => {
  try {
    const data = await downloadAlbum(tripId);

    const url = window.URL.createObjectURL(data);

    const link = document.createElement("a");

    link.href = url;
    link.download = "album.zip";

    document.body.appendChild(link);

    link.click();

    link.remove();
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

        <button onClick={handleDownloadAlbum}>
          Download Album ZIP
        </button>

        <input
          type="file"
          onChange={handleUpload}
        />

        <div>

          <select
            value={selectedMember}
            onChange={(e) =>
              setSelectedMember(e.target.value)
            }
          >
            <option value="">
              All Members
            </option>

            {
              trip &&
              trip.members.map(
                (member) => (
                  <option
                    key={member.user._id}
                    value={member.user.name}
                  >
                    {member.user.name}
                  </option>
                )
              )
            }

          </select>
          
          <select
            value={selectedMember}
            onChange={(e) =>
              setSelectedMember(e.target.value)
            }
          >
            <option value="">
              All Members
            </option>

            {
              trip &&
              trip.members.map(
                (member) => (
                  <option
                    key={member.user._id}
                    value={member.user.name}
                  >
                    {member.user.name}
                  </option>
                )
              )
            }

          </select>

          <input
            placeholder="Search uploader"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          {
            photos
              .filter(
                (photo) =>
                  photo.uploadedBy?.name
                    .toLowerCase()
                    .includes(
                      searchTerm.toLowerCase()
                    )
              )
              .filter(
                (photo) =>
                  selectedMember === "" ||
                  photo.uploadedBy?.name === selectedMember
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

                  <a
                    href={photo.imageUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </div>
              ))
          }
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