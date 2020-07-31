import React from "react";
import WelcomeMessage from "./WelcomeMessage";
import UserPostList from "./posts/UserPostList";
import ClientList from "./clients/ClientList";
import { ClientProvider } from "../providers/ClientProvider";
import UnreadEntryList from "./posts/UnreadEntryList";

export default function Dashboard() {

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    if (currentUser.userTypeId === 1) {
        return (
            <div className="container mt-4">
                <WelcomeMessage nickname={currentUser.nickName} />
                <h3>My Clients</h3>
                <hr />
                <ClientProvider>
                    <ClientList />
                </ClientProvider>
                <h3>Unread Entries</h3>
                <hr />
                <UnreadEntryList limit="0" start="0" />
            </div>
        );
    } else {
        return (
            <div className="container mt-4">
                <WelcomeMessage nickname={currentUser.nickName} className="mb-4" />
                <h3>My Recent Entries</h3>
                <hr />
                <UserPostList limit="3" start="0" />
            </div>
        );
    }

}