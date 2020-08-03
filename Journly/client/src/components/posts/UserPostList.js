/*
    UserPostList.js
    To be used by a client, gets a list of the current user's posts and renders them using the PostList component
    The "limit" prop can be used to only return a certain amount, if set to 0 it will return all
    The "start" prop tells the component which post to start on, may be used for a future pagination feature
*/

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