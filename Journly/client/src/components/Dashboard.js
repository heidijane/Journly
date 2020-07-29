import React from "react";
import WelcomeMessage from "./WelcomeMessage";
import ClientPostList from "./posts/ClientPostList";

export default function Dashboard() {

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    if (currentUser.userTypeId === 1) {
        return (
            <div className="container mt-4">
                <WelcomeMessage nickname={currentUser.nickName} />
            </div>
        );
    } else {
        return (
            <div className="container mt-4">
                <WelcomeMessage nickname={currentUser.nickName} className="mb-4" />
                <h3>My Recent Entries</h3>
                <hr />
                <ClientPostList limit="3" start="0" />
            </div>
        );
    }

}