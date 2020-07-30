import React, { useContext, useState, useEffect } from "react";
import { MoodContext } from "../../providers/MoodProvider";
import { Spinner, UncontrolledTooltip } from "reactstrap";
import "./MoodSelector.css"

export default function MoodSelector({ selectedMood, setSelectedMood }) {
    const { moods, getMoods } = useContext(MoodContext);
    const [loading, setLoading] = useState(true);

    console.log(moods)

    useEffect(() => {
        getMoods().then(setLoading(false));
    }, []);

    if (loading) {
        return (
            <Spinner />
        );
    } else {
        return (
            <div className="MoodIcon__Container bg-light rounded border d-flex flex-wrap justify-content-start">
                {
                    moods.map(mood => {
                        return (
                            <div key={"moodwrapper-" + mood.id}>
                                <img src={"emoji/" + mood.image + ".svg"} id={"mood-" + mood.id} alt={mood.name} className="MoodIcon" style={{ cursor: "pointer" }} />
                                <UncontrolledTooltip placement="top" target={"mood-" + mood.id}>
                                    {mood.name}
                                </UncontrolledTooltip>
                            </div>
                        )
                    })
                }
            </div>
        );
    }

}