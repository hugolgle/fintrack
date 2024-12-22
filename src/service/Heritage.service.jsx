import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const fetchAssets = async () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  return await axios.get(`http://localhost:5001/heritage/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchAssetById = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.get(`http://localhost:5001/heritage/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

  return await axios.post(`http://localhost:5001/heritage`, newAsset, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

  return await axios.put(`http://localhost:5001/heritage/${id}`, updatedAsset, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteAsset = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT manquant. L'utilisateur n'est pas authentifié.");
  }

  return await axios.delete(`http://localhost:5001/heritage/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
