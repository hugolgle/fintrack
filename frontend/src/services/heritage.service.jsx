import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = `${import.meta.env.VITE_API_URL}/heritage`;

export const fetchAssets = async () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  return await axios.get(`${API_URL}/user/${userId}`, {
    withCredentials: true,
  });
};

export const fetchAssetById = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

export const addAsset = async (assetData) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const {
    name,
    category,
    acquisitionDate,
    detail,
    acquisitionPrice,
    estimatePrice,
  } = assetData;

  const newAsset = {
    user: userId,
    name,
    category,
    acquisitionDate,
    detail,
    acquisitionPrice,
    estimatePrice,
  };

  return await axios.post(`${API_URL}`, newAsset, {
    withCredentials: true,
  });
};

export const editAsset = async (assetData) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  const {
    id,
    name,
    category,
    acquisitionDate,
    detail,
    acquisitionPrice,
    estimatePrice,
  } = assetData;

  const updatedAsset = {
    name,
    category,
    acquisitionDate,
    detail,
    acquisitionPrice,
    estimatePrice,
  };

  return await axios.put(`${API_URL}/${id}`, updatedAsset, {
    withCredentials: true,
  });
};

export const deleteAsset = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};
