"use client";
import axiosInstance from "@/lib/axios";
import { LocalStorageHandler } from "@/lib/utils";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUserAuth: React.Dispatch<React.SetStateAction<User | null>>;
  setNewProfilePhoto: (pfp: FormData) => Promise<void>;
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const userInfo = LocalStorageHandler.getUserToken();
    if (userInfo) {
      setUserAuth(userInfo);
    } else {
      router.push("/login");
    }
    setLoading(false); // Authentication check is done
  }, [router]);

  const setNewProfilePhoto = async (pfp: FormData) => {
    if (!pfp || !userAuth) return;

    try {
      const response = await axiosInstance.put("/users/update", pfp, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        const newUser = {
          ...userAuth,
          profilePicture: response.data.profilePicture,
        };

        setUserAuth(newUser);
        LocalStorageHandler.addUserToken(newUser);
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const login = async (username: string, password: string): Promise<any> => {
    try {
      const response = await axiosInstance.post("/users/login", {
        username,
        password,
      });
      if (response.data) {
        setUserAuth(response.data);
        LocalStorageHandler.addUserToken(response.data);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<any> => {
    try {
      const response = await axiosInstance.post("/users/register", {
        name,
        username,
        email,
        password,
      });
      if (response.data) {
        setUserAuth(response.data);
        LocalStorageHandler.addUserToken(response.data);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    LocalStorageHandler.removeUserToken();
    setUserAuth(null); // Reset userAuth state on logout
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user: userAuth,
        loading,
        setUser: setUserAuth,
        setUserAuth,
        register,
        logout,
        login,
        setNewProfilePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
