import React from "react";
import moment from "moment";
import "./JournalPageEntry.css"
import { Button } from "reactstrap";

export default function JournalPageEntry({ post }) {

    return (
        <div className="JournalPage">
            <a id={post.id}></a>
            <div className="d-flex flex-nowrap justify-content-start align-items-center">
                <img src={"/emoji/" + (!post.deleted ? post.mood.image : "26AA") + ".svg"} alt={post.mood.name} className="JournalPage__Mood mr-1" />
                <h4>{moment(post.createDate).format('h:mm a')}</h4>
                <Button color="light" size="sm" className="ml-1 p-0"><img src={"/emoji/270F.svg"} alt="edit post" /></Button>
                <Button color="light" size="sm" className="ml-1 p-0"><img src={"/emoji/E262.svg"} alt="delete post" /></Button>
            </div>
            {
                post.content &&
                <div className="content">{!post.deleted ? post.content : <span className="font-italic text-muted">This entry has been deleted.</span>}</div>
            }
            {
                post.editTime &&
                <div className="mt-3">
                    <span className="font-italic text-muted">This entry was edited on {moment(post.editTime).format('MMMM Do YYYY [at] h:mm a')}.</span>
                </div>
            }
            {
                post.viewTime &&
                <div className="TherapistComment rounded p-2 mt-2">
                    <div className="d-flex justify-content-start align-items-center py-0 flex-nowrap">
                        <img src={"/emoji/" + (post.comment ? "E263" : "2714") + ".svg"} alt="entry has been read" className="checkmark mr-1" />
                        <div>
                            <div className="text-muted font-italic overflow-hidden">
                                Viewed by {post.therapist.nickName} on {moment(post.viewDate).format('MMMM Do YYYY [at] h:mm a')}
                            </div>
                        </div>
                    </div>
                    {
                        post.comment &&
                        <div>{post.comment}</div>
                    }
                </div>
            }
        </div>
    )
}