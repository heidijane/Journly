import React, { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";

export const MoodContext = React.createContext();

export const MoodProvider = (props) => {
    const { getToken } = useContext(UserContext)
    const [moods, setMoods] = useState([]);

    const apiUrl = '/api/mood'

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