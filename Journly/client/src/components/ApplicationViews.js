/*
    ApplicationViews.js
    Sets up all the URL routes used by the application. Very important!
*/

import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import Start from "./Start";
import RegisterClient from "./auth/RegisterClient";
import RegisterCounselor from "./auth/RegisterCounselor";
import Dashboard from "./Dashboard";
import { TherapistInfoProvider } from "../providers/TherapistInfoProvider";
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
import UserPostList from "./posts/UserPostList";

export default function ApplicationViews() {
    const { isLoggedIn } = useContext(UserContext);
    const currentUser = (sessionStorage.getItem("userData") ? JSON.parse(sessionStorage.getItem("userData")) : null);

    return (
        <main>
            <Switch>

                {/* Default path, if a user is loggedin take them to the dashboard, otherwise send them to the login page */}
                <Route exact path="/">
                    {isLoggedIn ? <Dashboard /> : <Redirect to="/start" />}
                </Route>

                {/* This is the "home" page that should show when a user is not logged in */}
                <Route path="/start">
                    <Start />
                </Route>

                {/* The register client form without a counselor code */}
                <Route exact path="/registerclient">
                    <TherapistInfoProvider>
                        <RegisterClient />
                    </TherapistInfoProvider>
                </Route>

                {/* The register client form with a counselor code */}
                <Route path="/registerclient/:code">
                    <TherapistInfoProvider>
                        <RegisterClient />
                    </TherapistInfoProvider>
                </Route>

                {/* Register counselor form */}
                <Route path="/registercounselor">
                    <RegisterCounselor />
                </Route>

                {/* The "Mood Wall", a grid of recently used mood emojis by clients */}
                <Route path="/moodwall">
                    <MoodProvider>
                        <div className="container py-4">
                            <MoodWall limit="54" />
                        </div>
                    </MoodProvider>
                </Route>

                {/* Shows the current users entries if they are a client */}
                <Route path="/myentries">
                    {isLoggedIn && currentUser.userTypeId === 0 ?
                        <div className="container py-4">
                            <h3>My Journal Entries</h3>
                            <hr />
                            <UserPostList limit="0" start="0" />
                        </div>
                        :
                        <Redirect to="/start" />}
                </Route>

                {/* Shows the new journal entry form */}
                <Route path="/newentry">
                    {isLoggedIn && currentUser.userTypeId === 0 ? <MoodProvider><AddEntryForm /></MoodProvider> : <Redirect to="/start" />}
                </Route>

                {/* Shows the edit journal entry form, id paramenter is required */}
                <Route path="/editentry/:id">
                    {isLoggedIn && currentUser.userTypeId === 0 ? <MoodProvider><EditEntryForm /></MoodProvider> : <Redirect to="/start" />}
                </Route>

                {/* Shows posts matching :date parameter for the current user, only works for clients */}
                <Route path="/myjournal/:date">
                    {isLoggedIn && currentUser.userTypeId === 0 ? <MyJournal /> : <Redirect to="/start" />}
                </Route>

                {/* Shows posts matching the :date parameter for the user matching the :id parameter, only works for therapists */}
                <Route path="/userjournal/:id/:date">
                    {isLoggedIn && currentUser.userTypeId === 1 ? <UserJournal /> : <Redirect to="/start" />}
                </Route>

                {/* Shows a list of journal entries matching several optional URL parameters (see comments in FilterEntries.js for details)
                When rendered without any parameters it will show all of a therapist's clients' entries */}
                <Route path="/entries">
                    {isLoggedIn && currentUser.userTypeId === 1 ? <ClientProvider><FilterEntries /></ClientProvider> : <Redirect to="/start" />}
                </Route>

                {/* Renders a page with client details, to be used by a therapist */}
                <Route path="/client/:id">
                    {isLoggedIn && currentUser.userTypeId === 1 ? <ClientProvider><ClientDetails /></ClientProvider> : <Redirect to="/start" />}
                </Route>

                {/* Renders a page with a list of a therapist's clients */}
                <Route path="/clientlist">
                    {isLoggedIn && currentUser.userTypeId === 1
                        ?
                        <ClientProvider>
                            <div className="container py-4">
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
