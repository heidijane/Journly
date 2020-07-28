import React, { useState } from "react";

export const TherapistInfoContext = React.createContext();

export const TherapistInfoProvider = (props) => {
    const [therapistInfo, setTherapistInfo] = useState({});

    const apiUrl = '/api/user/therapist/'

    const getTherapist = code => {
        return fetch(`${apiUrl}/${code}`)
            .then(response => {
                console.log(response);
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
            therapistInfo, getTherapist
        }}>
            {props.children}
        </TherapistInfoContext.Provider>
    );
};