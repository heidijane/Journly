import React from "react";
import { Card } from "reactstrap";
import "./Client.css"

export default function Client({ client }) {
    console.log(client)
    return (
        <Card color="light" className="d-flex flex-column align-items-center justify-content-center">
            {
                client.user.avatar
                    ?
                    <img src={client.user.avatar} alt={client.user.nickName + "'s avatar"} className="avatar avatar-large mb-2" />
                    :
                    <img className="avatar avatar-large mb-2" alt={client.user.nickName + "'s avatar"}></img>
            }
            <h4>{client.user.nickName}</h4>
            <h5 className="text-muted">{client.user.firstName} {client.user.lastName}</h5>
        </Card>
    )
}