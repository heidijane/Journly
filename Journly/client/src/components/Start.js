/*
    Start.js
    This is the default page that is shown to users that are not logged in.
    Contains the login form, register buttons for clients and therapists, a small version of the Mood Wall, and mental health resources.
*/

import React from "react"
import { useHistory } from "react-router-dom";
import Login from "./auth/Login";
import { Button, Alert, Card, CardHeader, CardBody } from "reactstrap";
import HealthResources from "./HealthResources";
import { MoodProvider } from "../providers/MoodProvider";
import MoodWall from "./moodwall/MoodWall";

export default () => {
    const history = useHistory();

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-sm">
                    <Card>
                        <CardHeader>
                            Sign In
                        </CardHeader>
                        <CardBody>
                            <Login />
                        </CardBody>
                    </Card>
                </div>
                <div className="col-sm">
                    <Button color="info" block onClick={() => history.push("/registerclient")} size="lg" className="h-75">Create a new Journly account!</Button>
                    <Button color="warning" block onClick={() => history.push("/registercounselor")} size="lg" className="h-25">Register as a Counselor or Therapist</Button>
                </div>
            </div>
            <div className="bg-light border rounded px-0 py-3 my-4">
                <MoodProvider>
                    <MoodWall limit="21" size="small" />
                </MoodProvider>
            </div>
            <Alert color="danger">
                <HealthResources />
            </Alert>
        </div>
    )
}