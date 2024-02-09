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
  token:string;
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
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      async (user: any) => {
        setCurrentUser(user ? { uid: user.uid, email: user.email,  token: await user.getIdToken() } : null);
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
   
          if (expirationTimestamp <= currentTime) {
            await SignOut();
            setCurrentUser(null);
          } 
        } catch (error) {}
      } 
    };

    checkTokenExpiration();
    const handleActivity = () => {
      setLastActivityTime(Date.now());
    };

    const checkInactivity = () => {
      const currentTime = Date.now();
      const inactiveDuration = currentTime - lastActivityTime;
      const maxInactiveTime = 15 * 60 * 1000; // 15 minutes
      if (inactiveDuration > maxInactiveTime) {
        SignOut();
        setCurrentUser(null);
      }
    };

    // Listen to user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // Check for inactivity periodically
    const inactivityInterval = setInterval(checkInactivity, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      unsubscribe();
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearInterval(inactivityInterval);
    };
  }, [lastActivityTime]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
