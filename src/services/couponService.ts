import { generateApiMetadata } from "../utils/apiMetadata";
import { forceLogout } from "../utils/auth";

const BASE_URL = "http://localhost:8080/api/v1/merchant/coupons";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { authorization: `Bearer ${token}` } : {};
};

const getEnvelopeHeaders = (channel: "ONL" | "OFF" = "ONL") => {
  const metadata = generateApiMetadata(channel);
  return {
    "x-request-id": metadata.requestId,
    "x-request-datetime": metadata.requestDateTime,
    "x-channel": metadata.channel
  };
};

export const couponService = {
  // GET: Fetch all coupons for a merchant
  getCoupons: async (merchantId: string, status?: string) => {
    let url = `${BASE_URL}?merchantId=${merchantId}`;
    if (status && status !== 'ALL') url += `&status=${status.toUpperCase()}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
        "accept": "*/*",
        ...getEnvelopeHeaders("ONL")
      }
    });

    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }
    
    if (!response.ok) throw new Error("Failed to fetch coupons");
    return response.json();
  },

  // GET: Fetch coupon detail
  getCouponDetail: async (couponId: string, merchantId: string) => {
    const url = `${BASE_URL}/${couponId}?merchantId=${merchantId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
        "accept": "*/*",
        ...getEnvelopeHeaders("ONL")
      }
    });

    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }
    
    if (!response.ok) throw new Error("Failed to fetch coupon detail");
    return response.json();
  },

  // POST: Create a new coupon
  createCoupon: async (couponData: any) => {
    const metadata = generateApiMetadata("ONL");
    const response = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...getEnvelopeHeaders("ONL")
      },
      body: JSON.stringify({
        requestId: metadata.requestId,
        requestDateTime: metadata.requestDateTime,
        channel: metadata.channel,
        data: couponData
      })
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }

    if (!response.ok) throw new Error("Failed to create coupon");
    return response.json();
  },

  // PUT: Update an existing coupon
  updateCoupon: async (couponId: string, couponData: any) => {
    const metadata = generateApiMetadata("OFF");
    const response = await fetch(`${BASE_URL}/${couponId}`, {
      method: "PUT",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...getEnvelopeHeaders("ONL")
      },
      body: JSON.stringify({
        requestId: metadata.requestId,
        requestDateTime: metadata.requestDateTime,
        channel: metadata.channel,
        data: couponData
      })
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }

    if (!response.ok) throw new Error("Failed to update coupon");
    return response.json();
  },

  // DELETE: Delete a coupon
  deleteCoupon: async (couponId: string, merchantId: string) => {
    const url = `${BASE_URL}/${couponId}?merchantId=${merchantId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
        "accept": "*/*",
        ...getEnvelopeHeaders("ONL")
      }
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }

    if (!response.ok) throw new Error("Failed to delete coupon");
    return response.json().catch(() => ({ success: true }));
  }
};
