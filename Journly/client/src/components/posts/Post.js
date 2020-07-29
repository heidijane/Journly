import React from "react";
import { Card, CardBody } from "reactstrap";
import moment from "moment";

export default function Post({ post }) {
    return (
        <Card color="light">
            <CardBody>
                <h5>{moment(post.createDate).format('MMMM Do YYYY, h:mm a')}</h5>
                <p>{post.content}</p>
            </CardBody>
        </Card>
    )
}