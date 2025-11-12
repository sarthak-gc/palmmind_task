import { axios } from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const getMe = async (token: string | null) => {
  try {
    const res = await axios.get("/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const id = res.data.id;
    if (!id) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const ProtectedRoute = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await getMe(token);
      setIsAuthenticated(authStatus);
    };

    checkAuth();
  }, [children, token]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
