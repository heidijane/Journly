import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import Start from "./Start";
import RegisterClient from "./RegisterClient";
import RegisterCounselor from "./RegisterCounselor";
import Dashboard from "./Dashboard";

export default function ApplicationViews() {
    const { isLoggedIn } = useContext(UserContext);

    return (
        <main>
            <Switch>
                <Route path="/" exact>
                    {isLoggedIn ? <Dashboard /> : <Redirect to="/start" />}
                </Route>

                <Route path="/start">
                    <Start />
                </Route>

                <Route path="/registerclient/:code">
                    <RegisterClient />
                </Route>

                <Route path="/registercounselor">
                    <RegisterCounselor />
                </Route>

            </Switch>
        </main>
    );
};
