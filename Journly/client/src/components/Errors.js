/*
    Errors.js
    Renders a list of errors when provided an array
*/

import React from "react"
import { Alert } from "reactstrap";

export default ({ errors }) => {

    if (errors.length > 0) {
        return (
            errors.map((error, index) => {
                return <Alert color="danger" key={"error-" + index}>{error}</Alert>
            })
        )
    } else {
        return (null);
    }

}