import React, { useState, useEffect, useContext } from "react";
import { Card, Spinner, Modal, ModalHeader, ModalBody } from "reactstrap";
import "./Client.css"
import { PostContext } from "../../providers/PostProvider";
import { Link } from "react-router-dom";
import ClientDetails from "./ClientDetails";
import Avatar from "../users/Avatar";

export default function Client({ client }) {
    const { getLatestPost, getUnreadCountByUser } = useContext(PostContext);
    const [post, setPost] = useState(null);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(true);

    //states for managing the client details modal
    const [clientModal, setClientModal] = useState(false);
    const clientModalToggle = () => setClientModal(!clientModal);

    useEffect(() => {
        getLatestPost(client.userId)
            .then(setPost)
            .then(() => {
                getUnreadCountByUser(client.userId)
                    .then(setUnread)
            })
            .then(setLoading(false));
    }, []);

    if (loading) {
        return <Spinner />
    } else {
        return (
            <>
                <Card color="light" className="Client d-flex flex-column align-items-center justify-content-center" onClick={clientModalToggle} style={{ cursor: "pointer" }}>
                    <div className="Avatar__Wrapper mt-3">
                        {
                            post &&
                            <img src={`/emoji/${post.mood.image}.svg`} alt={post.mood.name} className="Client__Mood" />
                        }
                        <Avatar avatar={client.user.avatar} color={client.user.favColor} name={client.user.nickName} size="large" />
                    </div>
                    <h4 className="mt-2 mb-0 pb-0">{client.user.nickName}</h4>
                    <h6 className="text-muted pt-0 mt-0">{client.user.firstName} {client.user.lastName}</h6>
                    <div className="mb-2"><Link to={`/entries?user=${client.user.id}&viewed=false`}>{unread} Unread</Link></div>
                </Card>
                <Modal isOpen={clientModal} toggle={clientModalToggle}>
                    <ModalHeader toggle={clientModalToggle}>
                        {client.user.nickName + "'s Details"}
                    </ModalHeader>
                    <ModalBody>
                        <ClientDetails propId={client.userId} />
                    </ModalBody>
                </Modal>
            </>
        )
    }
}