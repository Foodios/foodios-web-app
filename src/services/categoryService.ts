import { generateApiMetadata } from "../utils/apiMetadata";
import { forceLogout } from "../utils/auth";

const BASE_URL = "http://localhost:8080/api/v1/merchant/categories";

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

export const categoryService = {
  // GET: Fetch categories by store
  getCategories: async (storeId: string, status = "ACTIVE", activeOnly = true) => {
    const url = `${BASE_URL}?storeId=${storeId}&status=${status}&activeOnly=${activeOnly}`;
    
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
    
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  },

  // POST: Create category
  createCategory: async (data: any) => {
    const metadata = generateApiMetadata("OFF");
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
        data: {
          ...data,
          active: data.active !== undefined ? data.active : true,
          sortOrder: data.sortOrder || 0
        }
      })
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired. Please login again.");
    }
    
    if (!response.ok) throw new Error("Failed to create category");
    return response.json();
  },

  // PUT: Update category
  updateCategory: async (categoryId: string, data: any) => {
    const metadata = generateApiMetadata("OFF");
    const response = await fetch(`${BASE_URL}/${categoryId}`, {
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
          ...data,
          active: data.active !== undefined ? data.active : true
        }
      })
    });
    
    if (response.status === 401) {
      forceLogout();
      throw new Error("Session expired. Please login again.");
    }
    
    if (!response.ok) throw new Error("Failed to update category");
    return response.json();
  },

  // DELETE: Delete category
  deleteCategory: async (categoryId: string, storeId: string) => {
    const url = `${BASE_URL}/${categoryId}?storeId=${storeId}`;
    
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
      throw new Error("Session expired. Please login again.");
    }
    
    if (!response.ok) throw new Error("Failed to delete category");
    return response.json();
  },

  // GET: Fetch category detail
  getCategoryDetail: async (categoryId: string, storeId: string) => {
    const url = `${BASE_URL}/${categoryId}?storeId=${storeId}`;
    
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
    
    if (!response.ok) throw new Error("Failed to fetch category detail");
    return response.json();
  }
};
