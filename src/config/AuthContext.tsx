import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { firebaseAuth } from "./firebase-config";
import { SignOut } from "./AuthService";
import Loading from "../components/general/Loading";

interface User {
  uid: string;
  email: string;
}

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      async (user: any) => {
        setCurrentUser(user ? { uid: user.uid, email: user.email } : null);
        setLoading(false);
      },
      (authError) => {
        setError(authError);
        setLoading(false);
      }
    );

    const checkTokenExpiration = async () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const expirationTimestamp = new Date(
            tokenResult.expirationTime
          ).toUTCString();
          const currentTime = new Date().toUTCString();
          const expirationTimestampMillis = Date.parse(expirationTimestamp); // Convert expiration time string to milliseconds
          const currentTimeMillis = Date.parse(currentTime);
      

          if (expirationTimestampMillis <= currentTimeMillis) {
            await SignOut();
            setCurrentUser(null);
          } else {
            const timeUntilExpiration =
              expirationTimestampMillis - currentTimeMillis;

          }
        } catch (error) {}
      }
    };

    checkTokenExpiration();
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    // You can render an error message or redirect the user to an error page
    return <div>Error: {error.message}</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
