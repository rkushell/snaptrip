import { useEffect, useState, useRef, useCallback } from "react";
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

/* ── Force-download a cross-origin image via blob ─── */
async function downloadPhoto(imageUrl, filename = "photo.jpg") {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed:", err);
  }
}

/* ── Lightbox ─────────────────────────────────────── */
function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="lightbox-backdrop"
      id="lightbox"
      onClick={onClose}
    >
      <div
        className="lightbox-container"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.imageUrl}
          alt={photo.uploadedBy?.name ? `Photo by ${photo.uploadedBy.name}` : "Trip photo"}
          className="lightbox-img"
          id="lightbox-img"
        />
      </div>

      <button
        className="lightbox-close"
        id="lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {photo.uploadedBy?.name && (
        <div className="lightbox-info">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {photo.uploadedBy.name}
          <button
            id="lightbox-download"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: 0,
              fontFamily: "inherit",
            }}
            onClick={(e) => {
              e.stopPropagation();
              downloadPhoto(
                photo.imageUrl,
                `${photo.uploadedBy?.name ?? "photo"}.jpg`
              );
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Invite Code Strip ────────────────────────────── */
function InviteStrip({ code, onCopy, copied }) {
  if (!code) return null;
  return (
    <div className="invite-code-box">
      <span className="invite-code">{code}</span>
      <button
        id="copy-invite-btn"
        className={`invite-copy-btn ${copied ? "copied" : ""}`}
        onClick={onCopy}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

/* ── Delete Confirmation Modal ────────────────────── */
function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="mac-modal-backdrop" onClick={onCancel}>
      <div
        className="mac-modal"
        style={{ width: "320px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mac-modal-title">Delete Photo?</div>
        <div className="mac-modal-sub">
          This action cannot be undone. The photo will be permanently removed
          from the album.
        </div>
        <div className="mac-modal-actions">
          <button
            className="mac-btn"
            onClick={onCancel}
            id="delete-cancel-btn"
          >
            Cancel
          </button>
          <button
            className="mac-btn-danger"
            onClick={onConfirm}
            id="delete-confirm-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── TripPage ─────────────────────────────────────── */
function TripPage() {
  const { tripId } = useParams();

  const [photos, setPhotos] = useState([]);
  const [trip, setTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef(null);

  /* ── Data Fetching ── */
  const fetchTrip = useCallback(async () => {
    try {
      const data = await getTripById(tripId);
      setTrip(data);
    } catch (err) {
      console.error("Failed to load trip:", err);
    }
  }, [tripId]);

  const fetchPhotos = useCallback(async () => {
    try {
      const data = await getTripPhotos(tripId);
      setPhotos(data);
    } catch (err) {
      console.error("Failed to load photos:", err);
    }
  }, [tripId]);

  useEffect(() => {
    fetchPhotos();
    fetchTrip();
  }, [fetchPhotos, fetchTrip]);

  /* ── Upload ── */
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side image validation
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("File is too large. Max size is 20 MB.");
      e.target.value = "";
      return;
    }

    setUploadError("");
    setUploading(true);
    try {
      await uploadPhoto(tripId, file);
      fetchPhotos();
    } catch (err) {
      setUploadError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  /* ── Delete ── */
  const handleDeleteConfirmed = async () => {
    if (!photoToDelete) return;
    try {
      await deletePhoto(photoToDelete);
      fetchPhotos();
    } catch (err) {
      console.error("Failed to delete photo:", err);
    } finally {
      setPhotoToDelete(null);
    }
  };

  /* ── Invite ── */
  const handleCreateInvite = async () => {
    setLoadingInvite(true);
    try {
      const data = await createInvite(tripId);
      setInviteCode(data.invite.code);
    } catch (err) {
      console.error("Failed to create invite:", err);
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleCopyInvite = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode).catch(console.error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Download ZIP ── */
  const handleDownloadAlbum = async () => {
    setDownloading(true);
    try {
      const blob = await downloadAlbum(tripId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${trip?.title || "album"}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // free memory
    } catch (err) {
      console.error("Failed to download album:", err);
    } finally {
      setDownloading(false);
    }
  };

  /* ── Filtered Photos ── */
  const filteredPhotos = photos
    .filter((p) =>
      (p.uploadedBy?.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter(
      (p) =>
        selectedMember === "" || p.uploadedBy?.name === selectedMember
    );

  /* ── Toolbar Right Actions ── */
  const rightActions = (
    <>
      {/* Upload button */}
      <button
        id="upload-btn"
        className="mac-btn"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        style={{ fontSize: "12px" }}
        title="Upload a photo"
      >
        {uploading ? (
          <span className="spinner" />
        ) : (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
        {uploading ? "Uploading…" : "Upload"}
      </button>

      {/* Invite link */}
      <button
        id="invite-btn"
        className="mac-btn"
        onClick={handleCreateInvite}
        disabled={loadingInvite}
        style={{ fontSize: "12px" }}
        title="Generate an invite code"
      >
        {loadingInvite ? (
          <span
            className="spinner"
            style={{
              borderColor: "var(--gray-6)",
              borderTopColor: "var(--gray-2)",
            }}
          />
        ) : (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
        Invite
      </button>

      {/* Download ZIP */}
      <button
        id="download-zip-btn"
        className="mac-btn"
        onClick={handleDownloadAlbum}
        disabled={downloading || photos.length === 0}
        style={{ fontSize: "12px" }}
        title={photos.length === 0 ? "No photos to download" : "Download all as ZIP"}
      >
        {downloading ? (
          <span
            className="spinner"
            style={{
              borderColor: "var(--gray-6)",
              borderTopColor: "var(--gray-2)",
            }}
          />
        ) : (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
        {downloading ? "Preparing…" : "Download ZIP"}
      </button>
    </>
  );

  return (
    <div className="app-shell">
      {/* Hidden file input — image only, 20 MB cap */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleUpload}
        id="file-input"
      />

      {/* macOS Toolbar */}
      <Navbar
        title={trip?.title || "Trip"}
        showBack
        rightActions={rightActions}
      />

      <div className="app-content">
        {/* ── Sidebar ── */}
        <aside className="mac-sidebar" style={{ width: "240px" }}>

          {/* Trip Info Card */}
          {trip && (
            <div style={{ padding: "16px 16px 0" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #E8F2FF 0%, #B8D4FF 100%)",
                  borderRadius: "var(--radius-lg)",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--gray-4)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginBottom: "4px",
                  }}
                >
                  Album
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "var(--gray-1)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {trip.title}
                </div>
                {trip.description && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--gray-4)",
                      marginTop: "4px",
                    }}
                  >
                    {trip.description}
                  </div>
                )}
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--apple-blue)",
                    marginTop: "8px",
                    fontWeight: "500",
                  }}
                >
                  {photos.length} {photos.length === 1 ? "photo" : "photos"}
                </div>
              </div>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div
              style={{
                margin: "0 16px 12px",
                padding: "8px 12px",
                background: "rgba(255,59,48,0.08)",
                border: "1px solid rgba(255,59,48,0.2)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                color: "var(--apple-red)",
                lineHeight: "1.4",
              }}
            >
              {uploadError}
            </div>
          )}

          {/* Invite Code */}
          {inviteCode && (
            <div style={{ marginBottom: "16px" }}>
              <div
                className="sidebar-section-label"
                style={{ padding: "0 16px 6px" }}
              >
                Invite Code
              </div>
              <InviteStrip
                code={inviteCode}
                onCopy={handleCopyInvite}
                copied={copied}
              />
            </div>
          )}

          <div className="sidebar-divider" />

          {/* Members List */}
          {trip?.members && (
            <div>
              <div
                className="sidebar-section-label"
                style={{ padding: "12px 16px 4px" }}
              >
                Members ({trip.members.length})
              </div>

              {trip.members.map((member) => {
                const initials = member.user.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div key={member.user._id} className="member-item">
                    <div className="member-avatar">{initials}</div>
                    <span className="member-name">{member.user.name}</span>
                    <span
                      className={`member-role-badge ${
                        member.role === "admin" ? "role-admin" : "role-member"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* ── Main Photo Area ── */}
        <main className="mac-main">
          {/* Filter Bar */}
          <div className="filter-bar">
            {/* Search */}
            <div className="mac-search">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="photo-search"
                placeholder="Search by uploader"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Member filter */}
            {trip?.members && (
              <select
                id="member-filter"
                className="mac-select"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
              >
                <option value="">All Members</option>
                {trip.members.map((m) => (
                  <option key={m.user._id} value={m.user.name}>
                    {m.user.name}
                  </option>
                ))}
              </select>
            )}

            {/* Count */}
            <span
              style={{
                marginLeft: "auto",
                fontSize: "12px",
                color: "var(--gray-4)",
              }}
            >
              {filteredPhotos.length}{" "}
              {filteredPhotos.length === 1 ? "photo" : "photos"}
            </span>
          </div>

          {/* Empty upload zone */}
          {photos.length === 0 && (
            <div
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
              id="upload-zone"
            >
              <div className="upload-zone-icon">📷</div>
              <div className="upload-zone-text">Upload your first photo</div>
              <div className="upload-zone-sub">
                Click to select a photo · Max 20 MB
              </div>
            </div>
          )}

          {/* Photo Grid */}
          {filteredPhotos.length > 0 && (
            <div className="photo-grid">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo._id}
                  id={`photo-${photo._id}`}
                  className="photo-item"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={
                      photo.uploadedBy?.name
                        ? `Photo by ${photo.uploadedBy.name}`
                        : "Trip photo"
                    }
                    loading="lazy"
                  />

                  <div className="photo-overlay">
                    {photo.uploadedBy?.name && (
                      <div className="photo-uploader">
                        {photo.uploadedBy.name}
                      </div>
                    )}

                    <div
                      className="photo-overlay-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Per-photo download — blob fetch to force save dialog */}
                      <button
                        id={`download-${photo._id}`}
                        className="photo-action-btn"
                        title="Download photo"
                        onClick={() =>
                          downloadPhoto(
                            photo.imageUrl,
                            `${photo.uploadedBy?.name ?? "photo"}_${photo._id}.jpg`
                          )
                        }
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>

                      {/* Delete — triggers confirmation modal */}
                      <button
                        id={`delete-${photo._id}`}
                        className="photo-action-btn danger"
                        title="Delete photo"
                        onClick={() => setPhotoToDelete(photo._id)}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty filtered state */}
          {photos.length > 0 && filteredPhotos.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No photos found</div>
              <div className="empty-sub">
                Try a different search term or member filter.
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {/* Delete Confirmation */}
      {photoToDelete && (
        <DeleteConfirmModal
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setPhotoToDelete(null)}
        />
      )}
    </div>
  );
}

export default TripPage;