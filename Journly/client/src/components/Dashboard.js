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
                <div className="container mt-4">
                    <WelcomeMessage nickname={currentUser.nickName} />
                    <h3 className="d-flex justify-content-between">
                        My Clients
                    <Button color="success" className="AddClientButton" onClick={addClientModalToggle}>
                            <img src={"/emoji/1F9D1.svg"} alt="add client" /> Add Client
                    </Button>
                    </h3>
                    <hr />
                    <ClientProvider>
                        <ClientList />
                    </ClientProvider>
                    <h3>Unread Entries</h3>
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
            <div className="container mt-4">
                <WelcomeMessage nickname={currentUser.nickName} className="mb-4" />
                <h3>My Recent Entries</h3>
                <hr />
                <UserPostList limit="3" start="0" />
                <div className="bg-light border rounded px-0 py-3">
                    <MoodProvider>
                        <MoodWall limit="21" size="small" />
                    </MoodProvider>
                </div>

            </div>
        );
    }

}