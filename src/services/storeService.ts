import { generateApiMetadata } from "../utils/apiMetadata";
import { forceLogout } from "../utils/auth";

const BASE_URL = "http://localhost:8080/api/v1/merchant/stores";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { "authorization": `Bearer ${token}` } : {};
};

const getEnvelopeHeaders = () => {
  const metadata = generateApiMetadata("ONL");
  return {
    "x-request-id": metadata.requestId,
    "x-request-datetime": metadata.requestDateTime,
    "x-channel": metadata.channel
  };
};

export const storeService = {
  // GET: Fetch Merchant Stores
  getStores: async (merchantId: string) => {
    const response = await fetch(`${BASE_URL}?merchantId=${merchantId}`, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
        "accept": "*/*",
        ...getEnvelopeHeaders()
      }
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired. Please login again.");
    }
    
    if (!response.ok) throw new Error("Failed to fetch stores");
    return response.json();
  },

  // POST: Create Store Branch
  createStore: async (data: any) => {
    const metadata = generateApiMetadata("ONL");
    const response = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      body: JSON.stringify({
        requestId: metadata.requestId,
        requestDateTime: metadata.requestDateTime,
        channel: metadata.channel,
        data
      })
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired. Please login again.");
    }
    
    if (!response.ok) throw new Error("Failed to create store branch");
    return response.json();
  },

  getStoreDetail: async (storeId: string, merchantId: string) => {
    const response = await fetch(`${BASE_URL}/${storeId}?merchantId=${merchantId}`, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
        "accept": "*/*",
        ...getEnvelopeHeaders()
      }
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired. Please login again.");
    }
    
    if (!response.ok) throw new Error("Failed to fetch store detail");
    return response.json();
  },

  updateStore: async (storeId: string, data: any) => {
    const metadata = generateApiMetadata("ONL");
    const response = await fetch(`${BASE_URL}/${storeId}`, {
      method: "PUT",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      body: JSON.stringify({
        requestId: metadata.requestId,
        requestDateTime: metadata.requestDateTime,
        channel: metadata.channel,
        data
      })
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired. Please login again.");
    }
    
    if (!response.ok) throw new Error("Failed to update store branch");
    return response.json();
  }
};
