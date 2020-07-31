import React from "react"
import { FormGroup, Input, Label } from "reactstrap"

export default function AddClientModalContents({ user }) {
    return (
        <>
            <FormGroup>
                <Label for="counselorCode">My Counselor Code</Label>
                <Input type="text" id="counselorCode" name="counselorCode" defaultValue={user.therapistInfo.code} size="lg" disabled />
            </FormGroup>
            <FormGroup>
                <Label for="registrationLink">Registration Link</Label>
                <Input type="text"
                    id="registrationLink"
                    name="registrationLink"
                    defaultValue={window.location.protocol + "//" + window.location.hostname + "/registerclient/" + user.therapistInfo.code}
                    size="lg"
                    disabled
                />
            </FormGroup>
            <hr className="mx-n3" />
            <h4>How this works</h4>
            <div>blah blah blah</div>
        </>
    )
}