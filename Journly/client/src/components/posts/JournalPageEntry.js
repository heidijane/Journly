import React from "react";
import moment from "moment";
import "./JournalPageEntry.css"

export default function JournalPageEntry({ post }) {

    return (
        <div className="JournalPage">
            <div className="d-flex flex-nowrap justify-content-start align-items-center">
                <img src={"/emoji/" + (!post.deleted ? post.mood.image : "26AA") + ".svg"} alt={post.mood.name} className="JournalPage__Mood mr-1" />
                <h4>{moment(post.createDate).format('h:mm a')}</h4>
            </div>
            {
                post.content &&
                <div className="content">{!post.deleted ? post.content : <span className="font-italic text-muted">This entry has been deleted.</span>}</div>
            }
            {
                post.viewTime &&
                <div className="TherapistComment rounded p-2 mt-2">
                    <div className="d-flex justify-content-start align-items-center py-0 flex-nowrap">
                        <img src={"/emoji/2714.svg"} alt="entry has been read" className="checkmark mr-1" />
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