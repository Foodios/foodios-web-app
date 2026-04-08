import { generateApiMetadata } from "../utils/apiMetadata";

const BASE_URL = "http://localhost:8080/api/v1/public/merchants";

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

export const publicService = {
  // GET: Merchant detail by slug (including locations and products)
  getMerchantBySlug: async (slug: string) => {
    const response = await fetch(`${BASE_URL}/${slug}`, {
      method: "GET",
      headers: {
        "accept": "*/*",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
      }
    });

    if (!response.ok) throw new Error("Failed to fetch merchant details");
    return response.json();
  },

  // GET: Fetch list of merchants
  getMerchants: async () => {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "accept": "*/*",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.result?.description || "Failed to fetch merchants");
    }
    return response.json();
  },

  // GET: Search merchants by name
  searchMerchants: async (name: string, page: number = 0, size: number = 10) => {
    const response = await fetch(`http://localhost:8080/api/v1/merchants/search?name=${encodeURIComponent(name)}&pageNumber=${page}&pageSize=${size}`, {
      method: "GET",
      headers: {
        "accept": "*/*",
        ...getAuthHeader(),
        ...getEnvelopeHeaders()
      }
    });

    if (!response.ok) throw new Error("Search request failed");
    return response.json();
  }
};
