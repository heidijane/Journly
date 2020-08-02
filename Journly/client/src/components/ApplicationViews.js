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

export default function ApplicationViews() {
    const { isLoggedIn } = useContext(UserContext);

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

                <Route path="/myentries">
                    {isLoggedIn ? <MyEntries /> : <Redirect to="/start" />}
                </Route>

                <Route path="/newentry">
                    {isLoggedIn ? <MoodProvider><AddEntryForm /></MoodProvider> : <Redirect to="/start" />}
                </Route>

                <Route path="/editentry/:id">
                    {isLoggedIn ? <MoodProvider><EditEntryForm /></MoodProvider> : <Redirect to="/start" />}
                </Route>

                <Route path="/myjournal/:date">
                    {isLoggedIn ? <MyJournal /> : <Redirect to="/start" />}
                </Route>

                <Route path="/userjournal/:id/:date">
                    {isLoggedIn ? <UserJournal /> : <Redirect to="/start" />}
                </Route>

                <Route path="/entries">
                    {isLoggedIn ? <ClientProvider><FilterEntries /></ClientProvider> : <Redirect to="/start" />}
                </Route>

            </Switch>
        </main>
    );
};
