import { generateApiMetadata } from "../utils/apiMetadata";

const MERCHANT_BASE_URL = "http://localhost:8080/api/v1/admin/merchants";
const USER_BASE_URL = "http://localhost:8080/api/v1/admin/users";
const PROMO_BASE_URL = "http://localhost:8080/api/v1/admin/promotions";

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

export const adminService = {
    // GET: Fetch all merchants for admin
    getMerchants: async (page: number = 1, size: number = 20) => {
        const response = await fetch(`${MERCHANT_BASE_URL}?pageNumber=${page}&pageSize=${size}`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });

        if (!response.ok) throw new Error("Failed to fetch merchants list");
        return response.json();
    },

    // GET: Search merchants for admin
    searchMerchants: async (name: string, page: number = 1, size: number = 20) => {
        const response = await fetch(`${MERCHANT_BASE_URL}/search?name=${encodeURIComponent(name)}&pageNumber=${page}&pageSize=${size}`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });

        if (!response.ok) throw new Error("Search merchants failed");
        return response.json();
    },

    // GET: Fetch users by type
    getUsers: async (type: string, page: number = 1, size: number = 20) => {
        let path = "fetch-customers";
        const t = type.toLowerCase();
        
        if (t.includes("admin")) path = "fetch-admins";
        else if (t.includes("corporate") || t.includes("merchant")) path = "fetch-merchants";
        
        const response = await fetch(`${USER_BASE_URL}/${path}?pageNumber=${page}&pageSize=${size}`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });

        if (!response.ok) throw new Error(`Failed to fetch ${type} list`);
        return response.json();
    },

    // PUT: Update merchant information
    updateMerchant: async (merchantId: string, data: any) => {
        const metadata = generateApiMetadata("ONL");
        const response = await fetch(`${MERCHANT_BASE_URL}/update`, {
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
                    ...data,
                    id: merchantId // Ensure ID is included in data
                }
            })
        });

        if (!response.ok) throw new Error("Failed to update merchant");
        return response.json();
    },

    // DELETE: Remove merchant
    deleteMerchant: async (merchantId: string) => {
        const response = await fetch(`${MERCHANT_BASE_URL}/${merchantId}`, {
            method: "DELETE",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });

        if (!response.ok) throw new Error("Failed to delete merchant");
        return response.json();
    },

    // GET: Fetch global promotions
    getGlobalPromotions: async (status: string = "ACTIVE", page: number = 1, size: number = 20) => {
        const response = await fetch(`${PROMO_BASE_URL}?status=${status}&pageNumber=${page}&pageSize=${size}`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });

        if (!response.ok) throw new Error("Failed to fetch global promotions");
        return response.json();
    },

    // GET: Fetch promotion detail
    getPromotionDetail: async (promoId: string) => {
        const response = await fetch(`${PROMO_BASE_URL}/${promoId}`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });

        if (!response.ok) throw new Error("Failed to fetch promotion details");
        return response.json();
    },

    // POST: Create global promotion
    createPromotion: async (data: any) => {
        const metadata = generateApiMetadata("ONL");
        const response = await fetch(`${PROMO_BASE_URL}/create`, {
            method: "POST",
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
                data: data
            })
        });

        if (!response.ok) throw new Error("Failed to create promotion");
        return response.json();
    },

    // PUT: Update global promotion
    updatePromotion: async (promoId: string, data: any) => {
        const metadata = generateApiMetadata("ONL");
        const response = await fetch(`${PROMO_BASE_URL}/${promoId}`, {
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
                data: data
            })
        });

        if (!response.ok) throw new Error("Failed to update promotion");
        return response.json();
    },

    // DELETE: Remove global promotion
    deletePromotion: async (promoId: string) => {
        const response = await fetch(`${PROMO_BASE_URL}/${promoId}`, {
            method: "DELETE",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });

        if (!response.ok) throw new Error("Failed to delete promotion");
        return response.json();
    }
};
