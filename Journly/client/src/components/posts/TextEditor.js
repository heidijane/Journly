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
            //prevents users from pasting rich text including images and such
            onPaste={e => {
                e.preventDefault();
                document.execCommand('inserttext', false, e.clipboardData.getData('text/plain'))
            }}
        />
    );
}