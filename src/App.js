import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from "./Router";
import { auth, logOff } from "./services/auth";
export const UserContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(undefined);

  // Google Auth
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try{
          setUser(await auth(accessToken));
          return;
        }catch(error){
          toast.error("Sessão expirada. Faça login novamente.");
          logOff();
        }
      }
      setUser(null);
    };

    fetchUserData();
  },[]);

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
          <Router />
        </UserContext.Provider>
      </GoogleOAuthProvider>
      <ToastContainer position="bottom-center" autoClose={5000} newestOnTop theme="colored" />
    </div>
  );
}

export default App;
