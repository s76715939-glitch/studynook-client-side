import React, { createContext, useContext, useState, useEffect } from "react";

const RouteContext = createContext(undefined);

export function RouteProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to match paths like /rooms/:id
  const getParam = (paramName) => {
    const pathParts = currentPath.split("/");
    
    // Check if the current route is like /rooms/:id
    if (pathParts[1] === "rooms" && pathParts[2] && paramName === "id") {
      return pathParts[2];
    }
    return null;
  };

  return (
    <RouteContext.Provider value={{ currentPath, navigateTo, getParam }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useAppRouter() {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error("useAppRouter must be used within a RouteProvider");
  }
  return context;
}
