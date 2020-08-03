import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import Start from "./Start";
import RegisterClient from "./auth/RegisterClient";
import RegisterCounselor from "./auth/RegisterCounselor";
import Dashboard from "./Dashboard";
import { TherapistInfoProvider } from "../providers/TherapistInfoProvider";
import MyEntries from "./posts/MyEntries";
import MyJournal from "./posts/MyJournal";
import AddEntryForm from "./posts/AddEntryForm";
import { MoodProvider } from "../providers/MoodProvider";
import EditEntryForm from "./posts/EditEntryForm";
import UserJournal from "./posts/UserJournal";
import FilterEntries from "./posts/FilterEntries";
import { ClientProvider } from "../providers/ClientProvider";
import ClientDetails from "./clients/ClientDetails";
import ClientList from "./clients/ClientList";
import MoodWall from "./moodwall/MoodWall";

export default function ApplicationViews() {
    const { isLoggedIn } = useContext(UserContext);
    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    return (
        <main>
            <Switch>
                <Route exact path="/">
                    {isLoggedIn ? <Dashboard /> : <Redirect to="/start" />}
                </Route>

                <Route path="/start">
                    <Start />
                </Route>

                <Route exact path="/registerclient">
                    <TherapistInfoProvider>
                        <RegisterClient />
                    </TherapistInfoProvider>
                </Route>

                <Route path="/registerclient/:code">
                    <TherapistInfoProvider>
                        <RegisterClient />
                    </TherapistInfoProvider>
                </Route>

                <Route path="/registercounselor">
                    <RegisterCounselor />
                </Route>

                <Route path="/moodwall">
                    <MoodProvider>
                        <div className="container mt-4">
                            <MoodWall limit="54" />
                        </div>
                    </MoodProvider>
                </Route>

                <Route path="/myentries">
                    {isLoggedIn && currentUser.userTypeId === 0 ? <MyEntries /> : <Redirect to="/start" />}
                </Route>

                <Route path="/newentry">
                    {isLoggedIn && currentUser.userTypeId === 0 ? <MoodProvider><AddEntryForm /></MoodProvider> : <Redirect to="/start" />}
                </Route>

                <Route path="/editentry/:id">
                    {isLoggedIn && currentUser.userTypeId === 0 ? <MoodProvider><EditEntryForm /></MoodProvider> : <Redirect to="/start" />}
                </Route>

                <Route path="/myjournal/:date">
                    {isLoggedIn && currentUser.userTypeId === 0 ? <MyJournal /> : <Redirect to="/start" />}
                </Route>

                <Route path="/userjournal/:id/:date">
                    {isLoggedIn && currentUser.userTypeId === 1 ? <UserJournal /> : <Redirect to="/start" />}
                </Route>

                <Route path="/entries">
                    {isLoggedIn && currentUser.userTypeId === 1 ? <ClientProvider><FilterEntries /></ClientProvider> : <Redirect to="/start" />}
                </Route>

                <Route path="/client/:id">
                    {isLoggedIn && currentUser.userTypeId === 1 ? <ClientProvider><ClientDetails /></ClientProvider> : <Redirect to="/start" />}
                </Route>

                <Route path="/clientlist">
                    {isLoggedIn && currentUser.userTypeId === 1
                        ?
                        <ClientProvider>
                            <div className="container mt-4">
                                <h3>My Clients</h3>
                                <hr />
                                <ClientList />
                            </div>
                        </ClientProvider>
                        :
                        <Redirect to="/start" />}
                </Route>

            </Switch>
        </main>
    );
};
