import React, { useContext, useState, useEffect } from "react";
import { PostContext } from "../../providers/PostProvider";
import { Spinner } from "reactstrap";
import PostList from "./PostList";

export default function UnreadEntryList({ limit = 0, start = 0 }) {
    const { posts, getUnreadPosts } = useContext(PostContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUnreadPosts(limit, start).then(setLoading(false));
    }, []);

    if (loading) {
        return (
            <Spinner />
        );
    } else {
        return (
            <PostList posts={posts} />
        );
    }

}