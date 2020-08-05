/*
    Avatar.js
    Renders a user's avatar with their fav color depending on provided props.
    
    Props
    * avatar - an avatar object containing avatar image and name
    * color - the background color of the avatar, if left blank the bg will be transparent
    * name - users name that will appear in the avatar's alt text
    * size - determines size of avatar (small, default, medium, large, xLarge)
    * rounded - determines if avatar is circular or not, true or false
*/

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
            <div className={"avatar avatar-" + size + (!rounded ? " notRounded" : "")} style={{ backgroundColor: "#" + color }}>
                <img
                    src={"/emoji/1F464.svg"}
                    alt={(name && name + "'s avatar, ")}
                />
            </div>
        )
    }
}