import { generateApiMetadata } from "../utils/apiMetadata";
import { forceLogout } from "../utils/auth";

const BASE_URL = "http://localhost:8080/api/v1/merchant/reviews";

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

export const reviewService = {
  // GET: Fetch reviews for a merchant/store
  getReviews: async (params: { 
    merchantId: string; 
    storeId?: string; 
    status?: string; 
    sourceType?: string; 
    pageNumber?: number; 
    pageSize?: number;
  }) => {
    const queryParams = new URLSearchParams();
    queryParams.append("merchantId", params.merchantId);
    if (params.storeId) queryParams.append("storeId", params.storeId);
    if (params.status) queryParams.append("status", params.status);
    queryParams.append("sourceType", params.sourceType || "STORE");
    queryParams.append("pageNumber", (params.pageNumber || 1).toString());
    queryParams.append("pageSize", (params.pageSize || 20).toString());

    const response = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
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
    
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  },

  // POST: Reply to a review
  replyReview: async (reviewId: string, replyContent: string) => {
    const metadata = generateApiMetadata("ONL");
    const response = await fetch(`${BASE_URL}/${reviewId}/reply`, {
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
        data: {
          reply: replyContent
        }
      })
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired.");
    }

    if (!response.ok) throw new Error("Failed to reply to review");
    return response.json();
  }
};
