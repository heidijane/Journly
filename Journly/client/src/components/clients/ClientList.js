import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { ClientContext } from "../../providers/ClientProvider";
import Client from "./Client";
import "./ClientList.css"

export default function ClientList() {

    const { clients, getClients } = useContext(ClientContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getClients().then(setLoading(false));
    }, []);

    if (loading) {
        return <Spinner />
    } else {
        return (
            <div className="ClientList__Wrapper">
                <div className="ClientList">
                    {
                        clients.map(client => <div className="wrapper" key={"client-" + client.id}><Client client={client} /></div>)
                    }
                    <div className="wrapper invisible">invisible spacer</div>
                    <div className="wrapper invisible">invisible spacer</div>
                    <div className="wrapper invisible">invisible spacer</div>
                </div>
            </div>
        )
    }
}