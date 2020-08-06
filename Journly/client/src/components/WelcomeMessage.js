/*
    WelcomeMessage.js
    Renders a welcome message as an alert when provided with a nickname.
*/

import React from "react";
import { Alert } from "reactstrap";

export default ({ nickname }) => {

    return (
        <Alert color="success" className="d-flex justify-content-center align-items-center">
            <h2 className="mt-3">Welcome, {nickname}!</h2>
        </Alert>
    );
}