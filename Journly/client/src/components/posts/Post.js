import React from "react";
import { Card, CardBody } from "reactstrap";

export default function Post({ post }) {
    return (
        <Card color="light">
            <CardBody>
                <h5>{post.createDate}</h5>
                <p>{post.content}</p>
            </CardBody>
        </Card>
    )
}