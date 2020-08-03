/*
    PostList.js
    Renders a list of post cards when provided an array of posts. Works for both clients and therapists.
*/

import React from "react";
import Post from "./Post";
import "./PostList.css";

export default function PostList({ posts }) {
    return (
        <div className="PostList__Wrapper">
            <div className="PostList">
                {
                    posts.map(post => <div className="wrapper" key={"post-" + post.id}><Post post={post} /></div>)
                }
                <div className="wrapper invisible">invisible spacer</div>
                <div className="wrapper invisible">invisible spacer</div>
            </div>
        </div>
    )
}