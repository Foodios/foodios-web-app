export const forceLogout = () => {
    // Capture the current path before clearing storage
    const currentPath = window.location.pathname + window.location.search;
    
    // Clear all auth related data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("merchantId");
    
    // Redirect to login with the current path as a redirect parameter
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
  };
