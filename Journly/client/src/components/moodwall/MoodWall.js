import React, { useContext, useEffect, useState } from "react"
import { MoodContext } from "../../providers/MoodProvider"
import { Spinner } from "reactstrap";
import "./MoodWall.css"

export default function MoodWall({ limit = 50, size = "normal" }) {
    const { getMoodWall } = useContext(MoodContext)
    const [moodWall, setMoodWall] = useState(null);

    useEffect(() => {
        getMoodWall(limit).then(resp => setMoodWall(resp));
    }, []);

    if (moodWall === null) {
        return <Spinner />
    } else {
        return (
            <div className={"MoodWall" + (size === "small" ? " MoodWall__small" : "")}>
                <div className="MoodWall__Note">This is how people on Journly are feeling right now!</div>
                {
                    moodWall.map((mood, index) => {
                        return (
                            <img src={`/emoji/${mood.image}.svg`} alt={mood.name} key={"moodwall-" + index} />
                        )
                    })
                }
            </div>
        )
    }
}