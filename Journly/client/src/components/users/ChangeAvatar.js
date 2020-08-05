/*
    ChangeAvatar.js
    Allows users to change their avatar and avatar background color.
    Can be used by both clients and therapists
*/

import React, { useContext, useEffect, useState } from "react"
import { Spinner, Label, Input, Row, Col } from "reactstrap"
import { AvatarContext } from "../../providers/AvatarProvider";
import "./ChangeAvatar.css";

export default function ChangeAvatar({ toggle }) {
    const { avatars, getAvatars } = useContext(AvatarContext);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAvatars().then(() => {
            const defaultAvatar = avatars.shift();
            setLoading(false)
        });
    }, []);

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    if (loading) {
        return <Spinner />
    } else {
        return (
            <Row className="Avatar__Container d-flex flex-wrap justify-content-start">
                {
                    avatars.map(avatar => {
                        return (
                            <Col sm="2" key={"avatar-" + avatar.id}>
                                <Label check>
                                    <Input
                                        type="radio"
                                        name="avatarRadio"
                                        onClick={() => setSelectedAvatar(avatar)}
                                        defaultChecked={currentUser.avatarId === avatar.id ? true : false}
                                    />{' '}
                                    <img
                                        src={"/emoji/" + avatar.image + ".svg"}
                                        id={"avatar-" + avatar.id}
                                        alt={avatar.name}
                                        style={{ cursor: "pointer" }}
                                        className="Avatar__Icon"
                                    />
                                </Label>
                            </Col>
                        )
                    })
                }
            </Row>
        )
    }
}