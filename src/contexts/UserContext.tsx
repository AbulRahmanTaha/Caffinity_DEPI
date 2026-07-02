import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { User, ItokenData, Order } from "../types";
import { authService, orderService } from "../services/api";

interface UserContextType {
  isAuthenticated: boolean;
  tokenData: ItokenData | null;
  user: User | null;
  orders: Order[];
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, data: { password: string, confirmPassword: string }) => Promise<void>;
  updateProfile: (data: { firstName: string, lastName: string }) => Promise<void>;
  deleteAccount: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [tokenData, setTokenData] = useState<ItokenData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (authToken: string) => {
    try {
      const [profileResponse, ordersResponse] = await Promise.all([
        authService.getMe(authToken),
        orderService.getMyOrders(authToken).catch(err => {
          console.error("Failed to load orders", err);
          return null;
        })
      ]);
      const userData = profileResponse.data;
      setUser(userData);

      setOrders(Array.isArray(ordersResponse) ? ordersResponse : []);
    } catch (error) {
      console.error("Failed to load user profile", error);
    }
  };

  // Initial load: check for token and its expiration
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("auth_token");
      if (savedToken) {
        try {
          const decodedToken = jwtDecode<ItokenData>(savedToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            // Token expired
            handleLogout();
          } else {
            // Token valid
            setToken(savedToken);
            setTokenData(decodedToken);
            await loadUserProfile(savedToken);
          }
        } catch (error) {
          // Invalid token format
          handleLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (credentials: any) => {
    const loginPromise = async () => {
      const data = await authService.login(credentials);

      if (data.token) {
        const decodedToken = jwtDecode<ItokenData>(data.token);
        localStorage.setItem("auth_token", data.token);
        setToken(data.token);
        setTokenData(decodedToken);
        await loadUserProfile(data.token);
        return data;
      }
      throw new Error("No token received.");
    };

    try {
      await toast.promise(loginPromise(), {
        loading: "Logging in...",
        success: "Logged in successfully!",
        error: (err: any) => err.response?.data?.message || "Failed to login.",
      });
    } catch (error: any) {
      throw error;
    }
  };

  const handleLogout = async () => {
    const logoutPromise = async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error("Logout API failed, but clearing local session anyway.", error);
      } finally {
        localStorage.removeItem("auth_token");
        setToken(null);
        setTokenData(null);
        setUser(null);
        setOrders([]);
      }
    };

    await toast.promise(logoutPromise(), {
      loading: "Logging out...",
      success: "Logged out successfully.",
      error: "Failed to logout.",
    });
  };

  const handleForgetPassword = async (email: string) => {
    try {
      await toast.promise(authService.forgetPassword(email), {
        loading: "Sending reset link...",
        success: "If an account exists with this email, a password reset link has been sent.",
        error: (err: any) => err.response?.data?.message || "Failed to send reset email.",
      });
    } catch (error: any) {
      throw error;
    }
  };

  const handleResetPassword = async (resetToken: string, data: { password: string, confirmPassword: string }) => {
    try {
      await toast.promise(authService.resetPassword(resetToken, data), {
        loading: "Resetting password...",
        success: "Password reset successfully. You can now log in.",
        error: (err: any) => err.response?.data?.message || "Failed to reset password.",
      });
    } catch (error: any) {
      throw error;
    }
  };

  const handleUpdateProfile = async (data: { firstName: string, lastName: string }) => {
    if (!token) return;
    try {
      const response = await toast.promise(authService.updateMe(token, data), {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: (err: any) => err.response?.data?.message || "Failed to update profile.",
      });
      setUser(response.data);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return false;

    const deletePromise = async () => {
      const response = await authService.deleteMe(token);
      if (response.status === 204 || response.status === 200) {
        localStorage.removeItem("auth_token");
        setToken(null);
        setTokenData(null);
        setUser(null);
        setOrders([]);
        return true;
      }
      throw new Error("Failed to delete account.");
    };

    try {
      await toast.promise(deletePromise(), {
        loading: "Deleting account...",
        success: "Account deleted successfully.",
        error: (err: any) => err.response?.data?.message || "Failed to delete account.",
      });
      return true;
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated: !!token && !!user,
        tokenData,
        user,
        orders,
        token,
        loading,
        login: handleLogin,
        logout: handleLogout,
        forgetPassword: handleForgetPassword,
        resetPassword: handleResetPassword,
        updateProfile: handleUpdateProfile,
        deleteAccount: handleDeleteAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
