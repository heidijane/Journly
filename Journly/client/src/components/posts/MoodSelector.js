import React, { useContext, useState, useEffect, useRef } from "react";
import { MoodContext } from "../../providers/MoodProvider";
import { Spinner, UncontrolledTooltip, Label, Input, FormGroup } from "reactstrap";
import "./MoodSelector.css"
import debounce from "../../utilities/debounce";

export default function MoodSelector({ selectedMood, setSelectedMood }) {
    const { moods, getMoods } = useContext(MoodContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMoods().then(setLoading(false));
    }, []);

    const filter = useRef();

    const filterMoods = debounce(() => {
        if (filter.current.value === "") {
            getMoods().then(setLoading(false));
        } else {
            getMoods(filter.current.value).then(setLoading(false));
        }
    }, 800);

    if (loading) {
        return (
            <Spinner />
        );
    } else {
        return (
            <div className=" bg-light rounded border">
                <FormGroup className="m-2">
                    <Input type="text" id="moodFilter" name="moodFilter" innerRef={filter} placeholder="start typing to filter moods" onChange={filterMoods} />
                </FormGroup>
                <div className="MoodIcon__Container d-flex flex-wrap justify-content-start">
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
            </div>
        );
    }

}