/*
    Dashboard.js
    Renders a dashboard for the current user
    Can be used by either clients or therapists
    For a client is renders the welcome message, their recent entries, and a small version of the Mood Wall
    For a therapist it renders the welcome message, a list of their clients, an Add Client button, and a list of recent unread entries
*/

import React, { useState } from "react";
import WelcomeMessage from "./WelcomeMessage";
import UserPostList from "./posts/UserPostList";
import ClientList from "./clients/ClientList";
import { ClientProvider } from "../providers/ClientProvider";
import UnreadEntryList from "./posts/UnreadEntryList";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import AddClientModalContents from "./clients/AddClientModal"
import "./Dashboard.css"
import MoodWall from "./moodwall/MoodWall";
import { MoodProvider } from "../providers/MoodProvider";

export default function Dashboard() {

    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);
    //modal states for the add client modal
    const [addClientModal, setAddClientModal] = useState(false);
    const addClientModalToggle = () => setAddClientModal(!addClientModal);

    if (currentUser.userTypeId === 1) {
        return (
            <>
                <div className="container py-4">
                    <WelcomeMessage nickname={currentUser.nickName} />
                    <h2 className="d-flex justify-content-between align-items-center">
                        My Clients
                    <Button color="success" className="AddClientButton" onClick={addClientModalToggle} style={{ height: "36px" }}>
                            <img src={"/emoji/1F9D1.svg"} alt="add client" /> Add Client
                    </Button>
                    </h2>
                    <hr />
                    <ClientProvider>
                        <ClientList />
                    </ClientProvider>
                    <h2>Unread Entries</h2>
                    <hr />
                    <UnreadEntryList limit="6" start="0" />
                </div>
                <Modal isOpen={addClientModal} toggle={addClientModalToggle}>
                    <ModalHeader toggle={addClientModalToggle}>
                        Add a Client
            </ModalHeader>
                    <ModalBody>
                        <AddClientModalContents user={currentUser} />
                    </ModalBody>
                </Modal>
            </>
        );
    } else {
        return (
            <div className="container py-4">
                <WelcomeMessage nickname={currentUser.nickName} className="mb-4" />
                <h2>My Recent Entries</h2>
                <hr />
                <UserPostList limit="3" start="0" />
                <div className="bg-light border rounded px-0 py-3 mt-4">
                    <MoodProvider>
                        <MoodWall limit="21" size="small" />
                    </MoodProvider>
                </div>

            </div>
        );
    }

}