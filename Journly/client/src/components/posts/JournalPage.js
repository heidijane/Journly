import React from "react";
import JournalPageEntry from "./JournalPageEntry";
import moment from "moment";
import { Alert, Card } from "reactstrap";

export default function JournalPage({ posts }) {
    if (posts.length > 0) {

        const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

        return (
            <div className="container mt-4">
                {
                    currentUser.userTypeId === 1 &&
                    <h2 className="d-flex justify-content-start align-items-center">
                        {
                            posts[0].user.avatar
                                ?
                                <img src={posts[0].user.avatar} alt={posts[0].user.nickName + "'s avatar"} className="avatar" />
                                :
                                <img alt={posts[0].user.nickName + "'s avatar"} className="avatar" />
                        }
                        <span className="ml-2">{posts[0].user.nickName}'s Journal</span>
                    </h2>
                }
                <h2>{moment(posts[0].createDate).format('MMMM Do YYYY')}</h2>
                <Card className="bg-light rounded border">
                    {
                        posts.map(post => <JournalPageEntry post={post} key={"post-" + post.id} />)
                            .reduce((acc, x) => acc === null ? [x] : [acc, <hr className="m-0" key={"posthr-" + x} />, x], null)
                    }
                </Card>
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