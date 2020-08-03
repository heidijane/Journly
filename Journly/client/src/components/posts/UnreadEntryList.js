import React, { useContext, useState, useEffect } from "react";
import { PostContext } from "../../providers/PostProvider";
import { Spinner, Alert, Button } from "reactstrap";
import PostList from "./PostList";
import { useHistory } from "react-router-dom";

export default function UnreadEntryList({ limit = 0, start = 0 }) {
    const { unreadPosts, getUnreadPosts, getUnreadCount } = useContext(PostContext);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const history = useHistory();
    useEffect(() => {
        getUnreadPosts(limit, start)
            .then(() => {
                getUnreadCount().then(setUnreadCount);
            })
            .then(setLoading(false));
    }, []);

    if (loading) {
        return (
            <Spinner />
        );
    } else {
        if (unreadPosts.length > 0) {
            return (
                <>
                    <PostList posts={unreadPosts} />
                    {
                        unreadCount > 6 &&
                        <Button color="primary" className="mt-n4 mb-4" block onClick={() => history.push("/entries?viewed=false")}>View All Unread Entries</Button>
                    }
                </>
            );
        } else {
            return <Alert color="success" className="text-center">No unread entries. You are all caught up!</Alert>
        }
    }

}