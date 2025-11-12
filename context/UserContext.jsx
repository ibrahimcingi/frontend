// context/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { Root } from "../config.js";
import { useNavigate } from "react-router-dom";




const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready,setReady]=useState(false)

  const navigate=useNavigate()

  const fetchUser = async () => {
      try{
        const res = await fetch(`${Root}/api/users/me`, { credentials: "include" });
      const data = await res.json();
      if(res.ok){
        console.log('from user context',data.user)
        console.log(ready)
        setUser(data.user)
        setLoading(false);
      }else if(res.status===401){
        navigate('/login')
      }
      }catch(error){
        console.error("❌ User fetch error:", error);
      } 
    

    }
  useEffect(() => {
      fetchUser();
     }, [ready]);
     

  return (
    <UserContext.Provider value={{ user, setUser,loading,setLoading,setReady }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
