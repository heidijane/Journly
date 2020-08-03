/*
    Post.js
    Renders a post preview card, to be used in conjunction with PostList.
    Works for either a client or a therapist.
    Post content is truncated.
    If the post is flagged and the current user is their therapist, the card will be highlighted in red
    If the current user is a client they will see if their therapist has viewed their post yet or not.
*/

import React from "react";
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader, UncontrolledTooltip } from "reactstrap";
import moment from "moment";
import "./Post.css";
import { truncate } from "../../utilities/truncate";

export default function Post({ post }) {

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    return (
        <Link
            to={
                currentUser.userTypeId === 0
                    ?
                    `/myjournal/${post.createDate}`
                    :
                    `/userjournal/${post.userId}/${post.createDate}`
            }
            className="text-decoration-none text-reset">
            <Card className={"Post" + (post.flagged && currentUser.userTypeId === 1 ? " flagged" : " bg-light")}>
                {
                    post.content &&
                    <div className="moodWrapper"><img src={"/emoji/" + (!post.deleted ? post.mood.image : "26AA") + ".svg"} alt={post.mood.name} className="mood" /></div>
                }
                <CardHeader className="d-flex justify-content-center pt-4" style={{ marginTop: "-15px" }}>
                    {
                        currentUser.userTypeId === 1 && post.flagged &&
                        <div className="flagWarning">
                            <img src="/emoji/26A0.svg" alt="read" id="warningIcon" className="warningIcon" />
                            <UncontrolledTooltip placement="top" target="warningIcon" style={{ backgroundColor: "rgb(255, 245, 155)" }}>
                                This post has been flagged for possibly containing concerning content.
                                Please review it as soon as possible and follow up with your client if necessary.
                                    </UncontrolledTooltip>
                        </div>
                    }
                    {
                        currentUser.userTypeId === 1 && post.viewTime !== null &&
                        (
                            post.comment === ""
                                ?
                                <>
                                    <img src="/emoji/2714.svg" alt="read" id={"viewed-" + post.id} className="viewIcon" />
                                    <UncontrolledTooltip placement="top" target={"viewed-" + post.id}>
                                        you viewed on<br />{moment(post.viewTime).format('M/D/YY, h:mm a')}
                                    </UncontrolledTooltip>
                                </>
                                :
                                <>
                                    <img src="/emoji/E263.svg" alt="commented" id={"viewed-" + post.id} className="viewIcon" />
                                    <UncontrolledTooltip placement="top" target={"viewed-" + post.id}>
                                        you commented on<br />{moment(post.viewTime).format('M/D/YY, h:mm a')}
                                    </UncontrolledTooltip>
                                </>
                        )
                    }
                    <h5 className="mt-1 mb-0">{moment(post.createDate).format('MMMM Do YYYY, h:mm a')}</h5>
                </CardHeader>
                <CardBody>
                    {
                        post.content
                            ?
                            <div className="content">
                                {!post.deleted ? truncate(post.content, 400) : <span className="font-italic text-muted">This entry has been deleted.</span>}
                            </div>
                            :
                            <img src={"/emoji/" + (!post.deleted ? post.mood.image : "26AA") + ".svg"} alt={post.mood.name} className="mood-large" />
                    }
                </CardBody>
                {
                    currentUser.userTypeId === 0 && post.viewTime &&
                    <CardFooter className="d-flex justify-content-start align-items-center py-0 flex-nowrap">
                        <img src={"/emoji/2714.svg"} alt="entry has been read" className="checkmark" />
                        <div>
                            <div className="text-muted font-italic overflow-hidden" style={{ fontSize: "small" }}>
                                Viewed by {post.therapist.nickName} on {moment(post.viewDate).format('MMMM Do YYYY [at] h:mm a')}
                            </div>
                        </div>
                    </CardFooter>
                }
                {
                    currentUser.userTypeId === 1 &&
                    <CardFooter className="d-flex justify-content-center align-items-center p-0 flex-nowrap">
                        <div>
                            {
                                post.user.avatar
                                    ?
                                    <img src={post.user.avatar} alt={post.user.nickName + "'s avatar"} className="avatar" />
                                    :
                                    <div className="avatar"></div>
                            }

                        </div>
                        <div>
                            <div className="text-muted font-italic overflow-hidden" style={{ fontSize: "small" }}>
                                Posted by {post.user.nickName}
                            </div>
                        </div>
                    </CardFooter>
                }
            </Card>
        </Link >
    )
}