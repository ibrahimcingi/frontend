// context/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { Root } from "../config.js";
import { useNavigate } from "react-router-dom";

import { BookOpen} from 'lucide-react';




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
    if(ready){
      fetchUser();
    }
     }, [ready]);

     if(loading){
      return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
       <div className="text-center">
         {/* Animated Logo */}
         <div className="relative mb-8">
           <div className="w-32 h-32 border-4 border-purple-500/30 rounded-full"></div>
           <div className="w-32 h-32 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
           <div className="w-24 h-24 border-4 border-blue-500/30 rounded-full absolute top-4 left-4"></div>
           <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-4 left-4" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <BookOpen className="w-12 h-12 text-white animate-pulse" />
           </div>
         </div>

         {/* Loading Text */}
         <h2 className="text-2xl font-bold text-white mb-3">AutoBlog Yükleniyor</h2>
         <p className="text-gray-400 mb-6"> Kullanıcı Bilgileri Alınıyor ...</p>

         {/* Animated Dots */}
         <div className="flex items-center justify-center gap-2">
           <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
           <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
           <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
         </div>

         {/* Loading Bar */}
         <div className="mt-8 w-64 h-1.5 bg-slate-700 rounded-full overflow-hidden mx-auto">
           <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
         </div>
       </div>
     </div>
      )
     }

  return (
    <UserContext.Provider value={{ user, setUser,loading,setLoading,setReady }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
