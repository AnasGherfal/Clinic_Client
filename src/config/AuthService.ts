import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { firebaseAuth } from "./firebase-config";
import { LoginForm } from "../types/interfaces";
import { SignupForm } from "../types/interfaces";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firestore = getFirestore();

// Sign in functionality
export const SignIn = async ({ email, password }: LoginForm) => {
  try {
    const result = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const user = result.user;

    if (user) {
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Sign up functionality
export const SignUp = async ({
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
}: SignupForm) => {
  try {
    const result = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const user = result.user;
    const userDocRef = doc(firestore, "users", user.uid);
    await sendEmailVerification(result.user);

    await setDoc(userDocRef, {
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber,
      // Add any other user-specific data you want to store
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = () => {
  return firebaseAuth.currentUser;
};

// Sign out functionality
export const SignOut = async () => {
  try {
    // Clear the stored token from local storage
    localStorage.removeItem("authToken");

    await signOut(firebaseAuth);
  } catch (error) {
    throw error;
  }
};
