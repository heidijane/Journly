import React from "react"
import { DefaultEditor } from 'react-simple-wysiwyg';

export default function TextEditor() {
    const [html, setHtml] = React.useState('my <b>HTML</b>');

    const onChange = (e) => {
        console.log(e.target.value);
        setHtml(e.target.value);
    };

    return (
        <DefaultEditor value={html} onChange={onChange} />
    );
}