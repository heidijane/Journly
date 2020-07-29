import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import Start from "./Start";
import RegisterClient from "./auth/RegisterClient";
import RegisterCounselor from "./auth/RegisterCounselor";
import Dashboard from "./Dashboard";
import { TherapistInfoProvider } from "../providers/TherapistInfoProvider";
import MyEntries from "./posts/MyEntries";
import NewEntry from "./posts/NewEntry";

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
                    <MyEntries />
                </Route>

                <Route path="/newentry">
                    <NewEntry />
                </Route>

            </Switch>
        </main>
    );
};
