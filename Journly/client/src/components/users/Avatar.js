import React from "react"
import "./Avatar.css"

export default function Avatar({ avatar = null, color = "", name = null, size = "default", rounded = true }) {
    if (avatar) {
        return (
            <div className={"avatar avatar-" + size + (!rounded ? " notRounded" : "")} style={{ backgroundColor: "#" + color }}>
                <img
                    src={"/emoji/" + avatar.image + ".svg"}
                    alt={(name && name + "'s avatar, ") + avatar.name}
                />
            </div>
        )
    } else {
        return (
            <div className={"avatar avatar-" + size} style={{ backgroundColor: "#" + color }}></div>
        )
    }
}