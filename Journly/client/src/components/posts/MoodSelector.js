import React, { useContext, useState, useEffect } from "react";
import { MoodContext } from "../../providers/MoodProvider";
import { Spinner, UncontrolledTooltip, Label, Input } from "reactstrap";
import "./MoodSelector.css"

export default function MoodSelector({ selectedMood, setSelectedMood }) {
    const { moods, getMoods } = useContext(MoodContext);
    const [loading, setLoading] = useState(true);

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
                                <Label check>
                                    <Input type="radio" name="moodRadio" onClick={() => setSelectedMood(mood)} />{' '}
                                    <img src={"emoji/" + mood.image + ".svg"} id={"mood-" + mood.id} alt={mood.name} className="MoodIcon" style={{ cursor: "pointer" }} />
                                </Label>
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