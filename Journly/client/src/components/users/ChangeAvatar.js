/*
    ChangeAvatar.js
    Allows users to change their avatar and avatar background color.
    Can be used by both clients and therapists
*/

import React, { useContext, useEffect, useState } from "react"
import { Spinner, Label, Input, Row, Col, Button } from "reactstrap"
import { AvatarContext } from "../../providers/AvatarProvider";
import "./ChangeAvatar.css";
import { SliderPicker } from 'react-color';
import Avatar from "./Avatar";
import { useHistory, useLocation } from 'react-router-dom';
import { UserContext } from "../../providers/UserProvider";

export default function ChangeAvatar({ toggle }) {
    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    const { updateUser } = useContext(UserContext);

    const { avatars, getAvatars } = useContext(AvatarContext);
    const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);

    const [loading, setLoading] = useState(true);

    let location = useLocation();
    const history = useHistory();

    useEffect(() => {
        getAvatars().then(() => {
            const defaultAvatar = avatars.shift();
            setLoading(false)
        });
    }, []);

    const [color, setColor] = useState({
        background: "#" + currentUser.favColor,
    });


    const handleChangeComplete = (color) => {
        setColor({ background: color.hex })
    };

    //validate and submit the form
    const changeAvatar = () => {

        currentUser.avatarId = selectedAvatar.id;
        currentUser.favColor = color.background.substr(1);

        updateUser(currentUser)
            .then(toggle)
            .then(() => {
                //refreshes the current route to reflect the deletion
                history.push({ pathname: "/empty" });
                history.replace({ pathname: location.pathname })
            });

    }

    if (loading) {
        return <Spinner />
    } else {
        return (
            <>
                <Row>
                    <Col className="col-12 col-sm-auto d-flex justify-content-center">
                        <Avatar avatar={selectedAvatar} color={color.background.substr(1)} size="large" />
                    </Col>
                    <Col className="">
                        <Label>Choose a background color...</Label>
                        <SliderPicker
                            color={color.background}
                            onChangeComplete={handleChangeComplete}
                        />
                    </Col>
                </Row>
                <hr />
                <Row className="Avatar__Container d-flex flex-wrap justify-content-center row-cols-3 row-cols-sm-6">
                    {
                        avatars.map(avatar => {
                            return (
                                <Col key={"avatar-" + avatar.id}>
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
                <hr />
                <div className="text-right">
                    <Button type="button" color="secondary" onClick={toggle}>Cancel</Button>
                    <Button type="submit" color="primary" onClick={changeAvatar} className="ml-2">Save</Button>
                </div>
            </>
        )
    }
}