import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/heritage`;

export const fetchAssets = async () => {
  return await axios.get(`${API_URL}/user`, {
    withCredentials: true,
  });
};

export const fetchAssetById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

export const addAsset = async (assetData) => {
  const {
    name,
    category,
    acquisitionDate,
    detail,
    acquisitionPrice,
    estimatePrice,
  } = assetData;

  const newAsset = {
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
  return await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};
