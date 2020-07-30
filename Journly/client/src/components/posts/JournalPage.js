import React from "react";
import JournalPageEntry from "./JournalPageEntry";
import moment from "moment";
import { Alert } from "reactstrap";

export default function JournalPage({ posts }) {
    if (posts.length > 0) {
        return (
            <div className="container mt-4">
                <h2>{moment(posts[0].createDate).format('MMMM Do YYYY')}</h2>
                <div className="bg-light rounded border">
                    {
                        posts.map(post => <JournalPageEntry post={post} key={"post-" + post.id} />)
                            .reduce((acc, x) => acc === null ? [x] : [acc, <hr className="m-0" key={"posthr-" + x} />, x], null)
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div className="container mt-4">
                <Alert color="warning">There are no posts for this date.</Alert>
            </div>
        )
    }
}