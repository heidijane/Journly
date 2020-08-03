import React, { useContext, useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom";
import { ClientContext } from "../../providers/ClientProvider";
import { PostContext } from "../../providers/PostProvider";
import { Spinner } from "reactstrap";
import moment from "moment";

export default function ClientDetails({ propId = null }) {
    const { getClient } = useContext(ClientContext);
    const { posts, getUnreadCountByUser, searchPost } = useContext(PostContext);
    const [loading, setLoading] = useState(true);
    const [loadingUnread, setLoadingUnread] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [client, setClient] = useState(null);
    const [unread, setUnread] = useState(0);

    let { id } = useParams();
    if (id === undefined) {
        id = propId;
    }

    useEffect(() => {
        getClient(id).then(resp => {
            setClient(resp);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        getUnreadCountByUser(id).then(resp => {
            setUnread(resp);
            setLoadingUnread(false);
        });
    }, []);

    useEffect(() => {
        searchPost(id, null, null, true, 5).then(setLoadingPosts(false));
    }, []);

    if (loading) {
        return <Spinner />
    } else {
        return (
            <div className="container d-flex flex-column align-items-center justify-content-center">
                <div className="Avatar__Wrapper mt-3">
                    {
                        client.avatar
                            ?
                            <img src={client.avatar} alt={client.nickName + "'s avatar"} className="avatar avatar-x-large mb-2" />
                            :
                            <img className="avatar avatar-x-large mb-2" alt={client.nickName + "'s avatar"}></img>
                    }
                </div>
                <h4>{client.nickName}</h4>
                <h5 className="text-muted">{client.firstName} {client.lastName}</h5>
                <div className="d-flex justify-content-between border-left" style={{}}>
                    {
                        posts.map(post => {
                            return (
                                <div key={"post-" + post.id} className="border border-left-0 d-flex flex-column justify-content-between align-items-center p-2">
                                    <div><img src={`/emoji/${post.mood.image}.svg`} alt={post.mood.name} style={{ width: "100%" }} /></div>
                                    <h5 className="mb-0">{moment(post.createDate).format('M/D')}</h5>
                                    <div className="text-muted">{moment(post.createDate).format('h:mm a')}</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="w-100 mt-2">
                    {
                        loadingUnread
                            ?
                            <Spinner />
                            :
                            unread > 0 &&
                            <Link to={`/entries?user=${client.id}&viewed=false`} className="btn btn-primary btn-block mt-2">
                                {unread} Unread
                            </Link>
                    }

                    <Link to={`/entries?user=${client.id}`} className="btn btn-info btn-block mt-2">
                        View Journal
                    </Link>
                </div>
            </div>
        )
        return null;
    }
}