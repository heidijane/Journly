import React, { useState } from "react";

export const TherapistInfoContext = React.createContext();

export const TherapistInfoProvider = (props) => {
    const [therapistInfo, setTherapistInfo] = useState({});

    const apiUrl = '/api/user/therapist/'

    const getTherapist = code => fetch(`${apiUrl}/${code}`).then((res) => res.json()).then(setTherapistInfo);

    return (
        <TherapistInfoContext.Provider value={{
            therapistInfo, getTherapist
        }}>
            {props.children}
        </TherapistInfoContext.Provider>
    );
};