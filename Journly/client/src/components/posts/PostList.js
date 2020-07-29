import React from "react";
import Post from "./Post";
import "./PostList.css";
import { Card } from "reactstrap";

export default function PostList({ posts }) {
    return (
        <div className="PostList">
            {
                posts.map(post => <Post post={post} key={"post-" + post.id} />)
            }
            <Card className="invisible"></Card>
            <Card className="invisible"></Card>
        </div>
    )
}