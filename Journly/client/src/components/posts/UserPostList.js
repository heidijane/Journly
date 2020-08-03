import React, { useContext, useState, useEffect } from "react";
import { PostContext } from "../../providers/PostProvider";
import { Spinner, Alert } from "reactstrap";
import PostList from "./PostList";
import { Link } from "react-router-dom";

export default function UserPostList({ limit = 0, start = 0 }) {
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
        if (posts.length > 0) {
            return (
                <PostList posts={posts} />
            );
        } else {
            return (
                <Alert color="info" className="lead">
                    <div>You haven't written any journal entries yet!</div>
                    <Link to="/newentry">Click here to write one!</Link>
                </Alert>
            );
        }
    }

}