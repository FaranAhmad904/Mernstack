import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });


    const [token, setToken] = useState(
        localStorage.getItem("token")
    );


    // LOGIN
    const login = (userData, userToken) => {

        localStorage.setItem(
            "token",
            userToken
        );

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setToken(userToken);
        setUser(userData);
    };


    // LOGOUT
    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};