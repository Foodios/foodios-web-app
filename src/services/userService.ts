import { generateApiMetadata } from "../utils/apiMetadata";

const BASE_URL = "http://localhost:8080/api/v1/users";

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

export const userService = {
    // GET: Fetch saved restaurants
    getSavedRestaurants: async () => {
        const response = await fetch(`${BASE_URL}/favorites`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });

        if (!response.ok) throw new Error("Failed to fetch favorite restaurants");
        return response.json();
    },

    // POST: Toggle favorite status of a restaurant
    toggleFavorite: async (merchantId: string) => {
        const metadata = generateApiMetadata("ONL");
        const response = await fetch(`${BASE_URL}/favorites/toggle`, {
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
                merchantId: merchantId
            })
        });

        if (!response.ok) throw new Error("Failed to toggle favorite status");
        return response.json();
    },

    // Wallet APIs
    getWalletBalance: async () => {
        const response = await fetch("http://localhost:8080/api/v1/wallet/balance", {
            method: "GET",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });
        if (!response.ok) throw new Error("Failed to fetch wallet balance");
        return response.json();
    },

    topUpWallet: async (amount: number) => {
        const metadata = generateApiMetadata("ONL");
        const response = await fetch("http://localhost:8080/api/v1/wallet/top-up", {
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
                data: {
                    amount: amount,
                    description: `Wallet top-up of ${amount} VND`
                }
            })
        });
        if (!response.ok) throw new Error("Top-up failed");
        return response.json();
    },

    getWalletTransactions: async () => {
        const response = await fetch("http://localhost:8080/api/v1/wallet/transactions", {
            method: "GET",
            headers: {
                "accept": "*/*",
                ...getAuthHeader(),
                ...getEnvelopeHeaders()
            }
        });
        if (!response.ok) throw new Error("Failed to fetch wallet transactions");
        return response.json();
    }
};
