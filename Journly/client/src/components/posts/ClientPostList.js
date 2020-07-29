import React, { useContext, useState, useEffect } from "react";
import { PostContext } from "../../providers/PostProvider";
import { Spinner } from "reactstrap";
import PostList from "./PostList";

export default function ClientPostList() {
    const { posts, getCurrentUserPosts } = useContext(PostContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUserPosts(3).then(setLoading(false));
    }, []);

    if (loading) {
        return (
            <Spinner />
        );
    } else {
        return (
            <>
                <h2>My Recent Entries</h2>
                <hr />
                <PostList posts={posts} />
            </>
        );
    }

}