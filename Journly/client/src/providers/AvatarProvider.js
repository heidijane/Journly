/*
    AvatarProvider.js
    Interacts with the avatar API.

    Methods included:
    * getAvatars - returns a list of all the default avatars, used in the change avatar component
*/

import React, { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";

export const AvatarContext = React.createContext();

export const AvatarProvider = (props) => {
    const { getToken } = useContext(UserContext)
    const [avatars, setAvatars] = useState([]);

    const apiUrl = '/api/avatar'

    //returns a list of all the default avatars from the db
    const getAvatars = () => {
        return getToken().then((token) =>
            fetch(apiUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
                .then(setAvatars));
    };

    return (
        <AvatarContext.Provider value={{
            avatars, getAvatars
        }}>
            {props.children}
        </AvatarContext.Provider>
    );
};