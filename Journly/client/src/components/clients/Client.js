import React, { useState, useEffect, useContext } from "react";
import { Card, Spinner } from "reactstrap";
import "./Client.css"
import { PostContext } from "../../providers/PostProvider";

export default function Client({ client }) {
    const { getLatestPost } = useContext(PostContext);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log(client)

    useEffect(() => {
        getLatestPost(client.userId).then(setPost).then(setLoading(false));
    }, []);

    if (loading) {
        return <Spinner />
    } else {
        return (
            <Card color="light" className="d-flex flex-column align-items-center justify-content-center">
                {
                    post &&
                    <img src={`/emoji/${post.mood.image}.svg`} alt={post.mood.name} />
                }
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
}