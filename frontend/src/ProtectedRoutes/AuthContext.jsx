import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  // State for login status and user data
  const [login, setLogin] = useState(true);
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ login, setLogin, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
