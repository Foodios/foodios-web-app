import { generateApiMetadata } from "../utils/apiMetadata";

const BASE_URL = "http://localhost:8080/api/v1/carts";

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

export const cartService = {
  // POST: Add item to cart
  addItem: async (storeId: string, productId: string, quantity: number = 1) => {
    const metadata = generateApiMetadata("ONL");
    const response = await fetch(`${BASE_URL}/items`, {
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
          storeId,
          productId,
          quantity
        }
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.result?.description || "Failed to add item to cart");
    }
    
    return response.json();
  },

  // GET: Fetch cart details
  getCart: async (storeId: string) => {
    const response = await fetch(`${BASE_URL}?storeId=${storeId}`, {
      method: "GET",
      headers: {
        "accept": "*/*",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart details");
    }
    
    return response.json();
  },

  // POST: Create order from cart
  checkout: async (data: any) => {
    const metadata = generateApiMetadata("ONL");
    const response = await fetch(`http://localhost:8080/api/v1/orders/place`, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
      },
      body: JSON.stringify({
        ...metadata,
        data: data
      })
    });

    if (!response.ok) {
      throw new Error("Failed to place order");
    }
    
    return response.json();
  },

  // GET: Validate promo code
  validatePromo: async (code: string, storeId: string, amount: number) => {
    const response = await fetch(`http://localhost:8080/api/v1/promotions/validate?code=${code}&storeId=${storeId}&orderAmount=${amount}`, {
      method: "GET",
      headers: {
        "accept": "*/*",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
      }
    });

    if (!response.ok) {
      throw new Error("Invalid promo code");
    }
    
    return response.json();
  },

  // GET: Fetch order details for tracking
  getOrderDetail: async (orderId: string) => {
    const response = await fetch(`http://localhost:8080/api/v1/my-orders/${orderId}`, {
      method: "GET",
      headers: {
        "accept": "*/*",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }
    
    return response.json();
  },

  // GET: Fetch user order history
  getUserOrders: async (status: string = "PLACED", page: number = 1, size: number = 20) => {
    const response = await fetch(`http://localhost:8080/api/v1/my-orders?status=${status}&pageNumber=${page}&pageSize=${size}`, {
      method: "GET",
      headers: {
        "accept": "*/*",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order history");
    }
    
    return response.json();
  }
};
