import React from "react"
import { useHistory } from "react-router-dom";
import Login from "./Login";
import { Button, Alert } from "reactstrap";

export default () => {
    const history = useHistory();

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-sm">
                    <Login />
                </div>
                <div className="col-sm">
                    <Button color="info" block onClick={() => history.push("/registerclient")}>Create a new Journly account!</Button>
                    <Button color="warning" block onClick={() => history.push("/registercounselor")}>Register as a Counselor or Therapist</Button>
                </div>
            </div>
            <Alert color="danger">Mental Health Resources Go Here</Alert>
        </div>
    )
}