/*
    TherapistInfoProvider.js
    Interacts with the user API, specifically the GetByCounselorCode method which doesn't require authorization
*/

import React, { useState } from "react";

export const TherapistInfoContext = React.createContext();

export const TherapistInfoProvider = (props) => {
    const [therapistInfo, setTherapistInfo] = useState({});

    const apiUrl = '/api/user/therapist/'

    const getTherapist = code => {
        return fetch(`${apiUrl}/${code}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then(setTherapistInfo)
    };

    return (
        <TherapistInfoContext.Provider value={{
            therapistInfo, setTherapistInfo, getTherapist
        }}>
            {props.children}
        </TherapistInfoContext.Provider>
    );
};