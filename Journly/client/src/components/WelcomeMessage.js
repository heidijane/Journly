import React from "react";
import { Alert } from "reactstrap";

export default ({ nickname }) => {

    return (
        <Alert color="success">
            <h3 className="text-center">Welcome, {nickname}!</h3>
        </Alert>
    );
}