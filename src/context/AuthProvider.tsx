import { useContext, createContext, useState, ReactNode, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthContextProps {
  token: string;
  user: any;
  loginAction: (data: LoginData) => Promise<void>;
  logOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps ) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>(localStorage.getItem("site") || "");
  const navigate = useNavigate();
  const loginAction = useCallback(async (data: LoginData): Promise<void> => {
    try {
      const response = await fetch("your-api-endpoint/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.data) {
        setUser(res.data.user);
        setToken(res.token);
        localStorage.setItem("site", res.token);
        navigate("/dashboard");
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  }, [navigate]);

  const logOut = useCallback(() => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  }, [navigate]);

  const value = useMemo(
    () => ({
      token,
      user,
      loginAction,
      logOut,
    }),
    [token, user, loginAction, logOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);