import React, { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";

export const ClientContext = React.createContext();

export const ClientProvider = (props) => {
    const { getToken } = useContext(UserContext)
    const [clients, setClients] = useState([]);

    const apiUrl = '/api/client'

    const getClients = () => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/list`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
                .then(setClients));
    };

    const getClient = (id) => {
        return getToken().then((token) =>
            fetch(`${apiUrl}/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
        );
    }

    return (
        <ClientContext.Provider value={{
            clients, getClients, getClient
        }}>
            {props.children}
        </ClientContext.Provider>
    );
};