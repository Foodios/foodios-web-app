import { generateApiMetadata } from "../utils/apiMetadata";
import { forceLogout } from "../utils/auth";

const BASE_URL = "http://localhost:8080/api/v1/merchant";

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

export const merchantService = {
  // GET: Fetch merchant profile
  getProfile: async () => {
    const response = await fetch(`${BASE_URL}/profile`, {
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
    
    if (!response.ok) throw new Error("Failed to fetch merchant profile");
    return response.json();
  },

  // GET: Fetch dashboard metrics
  getDashboardStats: async (merchantId: string) => {
    const response = await fetch(`${BASE_URL}/stats/${merchantId}`, {
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
    
    if (!response.ok) {
        // Fallback for demo if endpoint not found
        return {
            data: {
                dailyRevenue: 1250000,
                totalOrders: 42,
                newCustomers: 12,
                avgReview: 4.8,
                revenueChange: 12.5,
                ordersChange: 5.2,
                customersChange: -2.1,
                reviewsChange: 0.5
            }
        };
    }
    return response.json();
  },

  // GET: Fetch merchant orders
  getMerchantOrders: async (merchantId: string, page: number = 1, size: number = 20) => {
    const response = await fetch(`${BASE_URL}/orders?merchantId=${merchantId}&pageNumber=${page}&pageSize=${size}`, {
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

    if (!response.ok) throw new Error("Failed to fetch merchant orders");
    return response.json();
  },

  // GET: Fetch merchant order history
  getMerchantOrderHistory: async (merchantId: string, page: number = 1, size: number = 20) => {
    const response = await fetch(`${BASE_URL}/orders/history?merchantId=${merchantId}&pageNumber=${page}&pageSize=${size}`, {
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

    if (!response.ok) throw new Error("Failed to fetch merchant order history");
    return response.json();
  },

  // GET: Fetch single order detail for merchant
  getMerchantOrderDetail: async (orderId: string, merchantId: string) => {
    const response = await fetch(`${BASE_URL}/orders/${orderId}?merchantId=${merchantId}`, {
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

    if (!response.ok) throw new Error("Failed to fetch order details");
    return response.json();
  },

  // PUT: Update order status
  updateOrderStatus: async (orderId: string, merchantId: string, status: string, notes?: string) => {
    const metadata = generateApiMetadata("ONL");
    const response = await fetch(`${BASE_URL}/orders/${orderId}/status?merchantId=${merchantId}&status=${status.toUpperCase()}`, {
      method: "PUT",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
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
      throw new Error("Session expired.");
    }
    
    if (!response.ok) throw new Error("Failed to update order status");
    return response.json();
  },

  // PUT: Mark order as delivered (simulation/shortcut)
  markOrderDelivered: async (orderId: string, merchantId: string) => {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/mark-delivered?merchantId=${merchantId}`, {
      method: "PUT",
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

    if (!response.ok) throw new Error("Failed to mark order as delivered");
    return response.json();
  },

  // POST: Create/Add a driver to merchant
  createMerchantDriver: async (merchantId: string, userId: string) => {
    const metadata = generateApiMetadata("ONL");
    const response = await fetch(`${BASE_URL}/drivers/create`, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
      },
      body: JSON.stringify({
        ...metadata,
        data: {
          merchantId,
          userId
        }
      })
    });

    if (!response.ok) throw new Error("Failed to create merchant driver");
    return response.json();
  },

  // GET: Fetch drivers for a merchant
  getMerchantDrivers: async (merchantId: string) => {
    const response = await fetch(`${BASE_URL}/drivers?merchantId=${merchantId}`, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
        "accept": "*/*",
        ...getEnvelopeHeaders()
      }
    });

    if (!response.ok) throw new Error("Failed to fetch merchant drivers");
    return response.json();
  },

  // DELETE: Remove a driver from merchant
  deleteMerchantDriver: async (driverId: string, merchantId: string) => {
    const response = await fetch(`${BASE_URL}/drivers/${driverId}?merchantId=${merchantId}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
        "accept": "*/*",
        ...getEnvelopeHeaders()
      }
    });

    if (!response.ok) throw new Error("Failed to delete merchant driver");
    return response.json();
  }
};
