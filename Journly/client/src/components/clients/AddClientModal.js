import React, { useState } from "react"
import { FormGroup, Input, Label, Button, InputGroup, InputGroupAddon } from "reactstrap"
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default function AddClientModalContents({ user }) {

    //create state for the copy to keyboard button
    const [copiedCode, setCopiedCode] = useState(false)
    const [copyCodeText, setCopyCodeText] = useState("Copy")

    const [copiedLink, setCopiedLink] = useState(false)
    const [copyLinkText, setCopyLinkText] = useState("Copy")

    return (
        <>
            <FormGroup>
                <Label for="counselorCode" className="font-weight-bold">My Counselor Code</Label>
                <InputGroup>
                    <Input type="text" id="counselorCode" name="counselorCode" defaultValue={user.therapistInfo.code} bsSize="lg" disabled />
                    <InputGroupAddon addonType="append">
                        <CopyToClipboard
                            text={user.therapistInfo.code}
                            onCopy={() => {
                                setCopiedCode({ copied: true });
                                setCopyCodeText("Copied!");
                                setCopyLinkText("Copy");
                            }
                            }>
                            <Button className="copyButton" href="#" color="info" size="lg">{copyCodeText}</Button>
                        </CopyToClipboard>
                    </InputGroupAddon>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <Label for="registrationLink" className="font-weight-bold">Registration Link</Label>
                <InputGroup>
                    <Input type="text"
                        id="registrationLink"
                        name="registrationLink"
                        defaultValue={window.location.protocol + "//" + window.location.hostname + "/registerclient/" + user.therapistInfo.code}
                        bsSize="lg"
                        disabled
                    />
                    <InputGroupAddon addonType="append">
                        <CopyToClipboard
                            text={window.location.protocol + "//" + window.location.hostname + "/registerclient/" + user.therapistInfo.code}
                            onCopy={() => {
                                setCopiedLink({ copied: true });
                                setCopyLinkText("Copied!");
                                setCopyCodeText("Copy");
                            }
                            }>
                            <Button className="copyButton" href="#" color="info" size="lg">{copyLinkText}</Button>
                        </CopyToClipboard>
                    </InputGroupAddon>
                </InputGroup>


            </FormGroup>
            <hr className="mx-n3" />
            <h4>How this works</h4>
            <div>
                <p>Your counselor code is a unique ID that is used by your clients when they register for Journly.
                When they register using this code it will link your account with theirs so that you will be able to see their journal entries.</p>
                You can provide them with the code so that they can type it in when registering OR you can e-mail them your registration link
                which will automatically fill the code in for them. Neat!
            </div>
        </>
    )
}