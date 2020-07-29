import React, { useContext, useState, useEffect } from "react";
import { PostContext } from "../../providers/PostProvider";
import { Spinner } from "reactstrap";
import PostList from "./PostList";

export default function ClientPostList({ limit = 0, start = 0 }) {
    const { posts, getCurrentUserPosts } = useContext(PostContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUserPosts(limit, start).then(setLoading(false));
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