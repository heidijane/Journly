/*
    TextEditor.js
    This component renders a WYSIWYG textarea using react-simple-wysiwyg.
*/
import React from 'react';
import "./TextEditor.css";
import CustomEditor from "./CustomEditor"
import "./TextEditor.css"

export default function TextEditor({ content, setContent }) {

    const updateText = (e) => {
        setContent(e.target.value);
    };

    return (
        <CustomEditor
            value={content}
            onChange={updateText}
        />
    );
}