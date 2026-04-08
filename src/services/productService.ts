import { generateApiMetadata } from "../utils/apiMetadata";
import { forceLogout } from "../utils/auth";

const BASE_URL = "http://localhost:8080/api/v1/merchant/products";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { authorization: `Bearer ${token}` } : {};
};

const getEnvelopeHeaders = () => {
  const metadata = generateApiMetadata("ONL");
  return {
    "x-request-id": metadata.requestId,
    "x-request-datetime": metadata.requestDateTime,
    "x-channel": metadata.channel
  };
};

export const productService = {
  getProducts: async (storeId: string, categoryId?: string, status?: string) => {
    let url = `${BASE_URL}?storeId=${storeId}`;
    if (categoryId && categoryId !== 'all') url += `&categoryId=${categoryId}`;
    if (status && status !== 'ALL') url += `&status=${status.toUpperCase()}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
        "accept": "*/*",
        ...getEnvelopeHeaders()
      }
    });

    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }
    
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  createProduct: async (productData: any) => {
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
        data: productData
      })
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }

    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  updateProduct: async (productId: string, productData: any) => {
    const metadata = generateApiMetadata("OFF");
    const response = await fetch(`${BASE_URL}/${productId}`, {
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
        data: productData
      })
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }

    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  deleteProduct: async (productId: string, storeId: string) => {
    const url = `${BASE_URL}/${productId}?storeId=${storeId}`;
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
        "accept": "*/*",
        ...getEnvelopeHeaders()
      }
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }

    if (!response.ok) {
        throw new Error("Failed to delete product.");
    }
    
    return response.json().catch(() => ({ success: true }));
  }
};
