import React from "react";
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
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
                    `/myjournal/${post.createDate}#${post.id}`
                    :
                    `/userjournal/${post.userId}/${post.createDate}#${post.id}`
            }
            className="text-decoration-none text-reset">
            <Card className={"Post" + (post.flagged && currentUser.userTypeId === 1 ? " flagged" : " bg-light")}>
                {
                    post.content &&
                    <div className="moodWrapper"><img src={"/emoji/" + (!post.deleted ? post.mood.image : "26AA") + ".svg"} alt={post.mood.name} className="mood" /></div>
                }
                <CardHeader className="d-flex justify-content-center pt-4" style={{ marginTop: "-15px" }}>
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
                                    <img alt={post.user.nickName + "'s avatar"} className="avatar" />
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