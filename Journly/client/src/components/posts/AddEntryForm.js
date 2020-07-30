import React, { useState, useRef } from "react";
import { Form, FormGroup, Button, Input } from "reactstrap";
import MoodSelector from "./MoodSelector";
import "./AddEntryForm.css"

export default function AddEntryForm() {
    const [selectedMood, setSelectedMood] = useState(null);

    const content = useRef();

    return (
        <div className="container mt-4">
            <Form>
                <FormGroup>
                    <h2>I'm feeling{selectedMood ? <img src={"emoji/" + selectedMood.image + ".svg"} alt={selectedMood.name} className="selectedMood" /> : "..."}</h2>
                    <MoodSelector selectedMood={selectedMood} setSelectedMood={setSelectedMood} />
                </FormGroup>
                <FormGroup>
                    <h2>What's going on? <span className="font-italic text-muted">Optional</span></h2>
                    <Input type="textarea" name="content" id="content" style={{ height: "400px" }} placeholder="Write as much or as little as you want!" />
                </FormGroup>
                <FormGroup className="text-right">
                    <Button type="submit" color="primary">Create New Entry</Button>
                </FormGroup>
            </Form>
        </div>
    );
}