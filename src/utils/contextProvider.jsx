
import React, { createContext, useState } from 'react'
export const MyContext = createContext()
export const MyProvider = ({ children }) => {
    const [userName, setUserName] = useState('')
    return (
        <>
            <MyContext.Provider value={ [userName, setUserName] } >
                {children}
            </MyContext.Provider>
        </>
    )
}
