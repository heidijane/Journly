/*
    ClientProvider.js
    Interacts with the client API.
    Methods only work for therapists.

    Methods included:
    * getClients - returns a list of all of a therapist's clients
    * getClient - returns one client user info when given a client ID
*/

import React, { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";

export const ClientContext = React.createContext();

export const ClientProvider = (props) => {
    const { getToken } = useContext(UserContext)
    const [clients, setClients] = useState([]);

    const apiUrl = '/api/client'

    //returns a list of all of a therapist's clients
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

    //returns one client user info when given a client ID
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