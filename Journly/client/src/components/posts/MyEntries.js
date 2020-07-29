import React from "react";
import ClientPostList from "./ClientPostList";

export default function MyEntries() {

    return (
        <div className="container mt-4">
            <h3>My Journal Entries</h3>
            <hr />
            <ClientPostList limit="0" start="0" />
        </div>
    );
}