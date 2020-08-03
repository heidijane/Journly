/*
    MoodProvider.js
    Interacts with the mood API.

    Users must be logged in to use getMoods, but getMoodWall will work for anyone

    Methods included:
    * getMoods - returns a list of all the mood emojis in the db, used in the MoodSelector component
    * getMoodWall - returns list of mood emojis recently used by other clients, no user info is attatched
*/

import React, { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";

export const MoodContext = React.createContext();

export const MoodProvider = (props) => {
    const { getToken } = useContext(UserContext)
    const [moods, setMoods] = useState([]);

    const apiUrl = '/api/mood'

    //returns a list of all the mood emojis in the db, used in the MoodSelector component
    //optional criterion parameter can be used to search the mood name for filtering
    const getMoods = (criterion = "") => {
        return getToken().then((token) =>
            fetch(apiUrl + (criterion === "" ? "" : `?criterion=${criterion}`), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
                .then(setMoods));
    };

    //returns list of mood emojis recently used by other clients, no user info is attatched
    const getMoodWall = (limit = 50) => {
        return fetch(`${apiUrl}/wall?limit=${limit}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return null;
                }
            })
    };

    return (
        <MoodContext.Provider value={{
            moods, getMoods, getMoodWall
        }}>
            {props.children}
        </MoodContext.Provider>
    );
};