import { auth } from '../firebaseConfig';
// MERGED IMPORTS: All auth functions in one place
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  signInAnonymously 
} from "firebase/auth";

// 1. Sign Up (Create new account)
export const registerUser = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save their "Display Name" (e.g. Yash Raj)
    await updateProfile(user, { displayName: username });
    
    return user;
  } catch (error) {
    throw error; 
  }
};

// 2. Login (Existing user)
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error; 
  }
};

// 3. Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// 4. Guest Login (Try as Guest)
export const loginGuest = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};