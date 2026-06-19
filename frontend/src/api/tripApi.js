import axiosInstance from "./axiosInstance";

export const getTrips = async () => {
  const response = await axiosInstance.get("/trips");
  return response.data;
};

export const createTrip = async (tripData) => {
  const response = await axiosInstance.post(
    "/trips",
    tripData
  );

  return response.data;
};

export const joinTrip = async (code) => {
  const response = await axiosInstance.post(
    "/trips/join",
    { code }
  );

  return response.data;
};

export const getTripPhotos = async (tripId) => {
    const response = await axiosInstance.get(
        `/photos/${tripId}`
    );
    return response.data;
};

export const uploadPhoto = async (tripId, file) => {
    const formData = new FormData();
    formData.append("image",file);
    const response = await axiosInstance.post(
        `/photos/${tripId}`,
        formData
    );
    return response.data;
}

export const deletePhoto = async (photoId) => {
  const response = await axiosInstance.delete(
    `/photos/${photoId}`
  );

  return response.data;
};

export const createInvite = async (tripId) => {
  const response = await axiosInstance.post(
    `/trips/${tripId}/invite`
  );

  return response.data;
};

export const getTripById = async (
  tripId
) => {

  const response =
    await axiosInstance.get(
      `/trips/${tripId}`
    );

  return response.data;

};