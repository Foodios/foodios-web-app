import { generateApiMetadata } from "../utils/apiMetadata";
import { forceLogout } from "../utils/auth";

const BASE_URL = "http://localhost:8080/api/v1/merchant/orders";

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

export const orderService = {
  // GET: Fetch orders for a store
  getOrders: async (storeId: string, status?: string) => {
    let url = `${BASE_URL}?storeId=${storeId}`;
    if (status && status !== 'all') url += `&status=${status.toUpperCase()}`;

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
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  // PUT: Update order status (Confirm, Ready, etc.)
  updateOrderStatus: async (orderId: string, status: string, notes?: string) => {
    const metadata = generateApiMetadata("OFF");
    const response = await fetch(`${BASE_URL}/${orderId}/status`, {
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
        data: {
          status: status.toUpperCase(),
          notes
        }
      })
    });

    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) throw new Error("Failed to update order status");
    return response.json();
  },

  // GET: Fetch user's order history
  getMyOrders: async (status: string = 'PREPARING', page: number = 1, size: number = 20) => {
    const url = `http://localhost:8080/api/v1/my-orders?status=${status.toUpperCase()}&pageNumber=${page}&pageSize=${size}`;

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
      throw new Error("Session expired");
    }

    if (!response.ok) throw new Error("Failed to fetch order history");
    return response.json();
  }
};
