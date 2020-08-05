import * as tslib_1 from "tslib";
import * as React from 'react';
import Editor from '../../../node_modules/react-simple-wysiwyg/lib/es/Editor';
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnNumberedList, BtnRedo, BtnStyles, BtnUnderline, BtnUndo, Separator, Toolbar, } from '../../../node_modules/react-simple-wysiwyg/lib/es/toolbar'
export default function TextEditor({ content, setContent }) {

    const updateText = (e) => {
        setContent(e.target.value);
    };


    function DefaultEditor(props) {
        return (React.createElement(Editor, tslib_1.__assign({}, props),
            React.createElement(Toolbar, null,
                React.createElement(BtnUndo, { type: 'button' }),
                React.createElement(BtnRedo, { type: 'button' }),
                React.createElement(Separator, null),
                React.createElement(BtnBold, { type: 'button' }),
                React.createElement(BtnItalic, { type: 'button' }),
                React.createElement(BtnUnderline, { type: 'button' }),
                React.createElement(Separator, null),
                React.createElement(BtnNumberedList, { type: 'button' }),
                React.createElement(BtnBulletList, { type: 'button' }),
                React.createElement(Separator, null),
                React.createElement(BtnClearFormatting, { type: 'button' }),
                React.createElement(Separator, null),
                React.createElement(BtnStyles, { className: 'form-control' }))));
    }

    return (
        <DefaultEditor
            value={content}
            onChange={updateText}
        />
    );
}