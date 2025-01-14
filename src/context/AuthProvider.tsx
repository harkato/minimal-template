import { useContext, createContext, useState, ReactNode, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthContextProps {
  token: string;
  user: User | null;
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
  const loginAction = useCallback(async (data: LoginData) => 
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (data.email === "user@mshimizu.com.br" && data.password === "user") {
          const fakeUser = { id: 1, name: "Usuário teste", email: data.email };
          const fakeToken = "fake-jwt-token";
          setUser(fakeUser);
          setToken(fakeToken);
          localStorage.setItem("site", fakeToken);
          navigate("/");
          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000); // Simulate network delay
    }),
    [navigate]);

  const logOut = useCallback(() => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/sign-in");
  }, [navigate]);

  const contextValue = useMemo(
    () => ({
      token,
      user,
      loginAction,
      logOut,
    }),
    [token, user, loginAction, logOut]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export default AuthProvider;