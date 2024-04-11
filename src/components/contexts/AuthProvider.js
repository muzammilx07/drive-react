import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('fetched')
      setCurrentUser(user);
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);
  

  function signup(email,password){
    return createUserWithEmailAndPassword(auth, email, password)
  }

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error logging in:", error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      console.log("signout")
    } catch (error) {
      console.error("Error logging out:", error.message);
      throw error;
    }
  }


  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isMenuOpen, 
    toggleMenu,
    triggerFetch,
    setTriggerFetch
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
