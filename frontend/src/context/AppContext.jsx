import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { httpClient } from '../api/httpClient';

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')
    const [isLoggedin , setIsLoggedin] = useState(false)
    const [userData , setUserData] = useState(false)

    const getUserData = async()=>{
        try {
            const {data}= await httpClient.get('/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAuthState = async () =>{
        try {
            const {data} = await httpClient.get('/api/auth/is-auth')
            if(data.success) {
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState()
    },[])

    const value={
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData,setUserData,
        getUserData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}