import React from "react";
import UserPostList from "./UserPostList";

export default function MyEntries() {

    return (
        <div className="container mt-4">
            <h3>My Journal Entries</h3>
            <hr />
            <UserPostList limit="0" start="0" />
        </div>
    );
}