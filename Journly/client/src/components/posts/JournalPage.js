/*
    JournalPage.js
    This component renders a list of posts organized by date when provided an array of posts as a prop.
    Therapists will see a "Mark All As Read" button at the bottom of the page if there are any unread entries.
    When clicked this will updated the viewTime of all un-viewed posts on this date to the current server time.
*/

import React, { useContext } from "react";
import JournalPageEntry from "./JournalPageEntry";
import moment from "moment";
import { Alert, Card, Button } from "reactstrap";
import { useHistory, useLocation } from 'react-router-dom';
import { PostContext } from "../../providers/PostProvider";
import Avatar from "../users/Avatar";

export default function JournalPage({ posts }) {

    const { markAllRead } = useContext(PostContext);

    let location = useLocation();
    const history = useHistory();

    //count unread posts
    let unreadCount = 0;
    for (let index = 0; index < posts.length; index++) {
        if (posts[index].viewTime === null) {
            unreadCount++;
        }
    }

    //makes a request to the server to update the viewTime of all un-read posts that match this date
    const markAllAsRead = () => {
        markAllRead(posts[0].userId, posts[0].createDate)
            .then(() => {
                //refreshes the current route to reflect the deletion
                history.push({ pathname: "/empty" });
                history.replace({ pathname: location.pathname });
            });
    }

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    if (posts.length > 0) {

        const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

        return (
            <div className="container py-4">
                {
                    currentUser.userTypeId === 1 &&
                    <h2 className="d-flex justify-content-start align-items-center">
                        <Avatar avatar={posts[0].user.avatar} color={posts[0].user.favColor} size="med" name={posts[0].user.nickName} />
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
                {
                    currentUser.userTypeId === 1 && unreadCount > 0 &&
                    <div className="mt-4">
                        <Button color="success" onClick={markAllAsRead}>Mark all as Read</Button>
                    </div>
                }
            </div>
        )
    } else {
        return (
            <div className="container py-4">
                <Alert color="warning">There are no posts for this date.</Alert>
            </div>
        )
    }
}