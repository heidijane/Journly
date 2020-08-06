/*
    CustomEditor.js
    The CustomEditor function creates a version of the react-simple-wysiwyg editor with custom css classes and without a link button
*/

import * as tslib_1 from "tslib";
import * as React from 'react';
import { Editor } from "react-simple-wysiwyg";
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnNumberedList, BtnRedo, BtnStyles, BtnUnderline, BtnUndo, Separator, Toolbar, } from "react-simple-wysiwyg";

export default function CustomEditor(props) {
    return (React.createElement(Editor, tslib_1.__assign({}, props),
        React.createElement(Toolbar, { className: 'wysiwyg-toolbar' },
            React.createElement(BtnUndo, { type: 'button' }),
            React.createElement(BtnRedo, { type: 'button' }),
            React.createElement(Separator, { className: 'wysiwyg-toolbar-divider' }),
            React.createElement(BtnBold, { type: 'button' }),
            React.createElement(BtnItalic, { type: 'button' }),
            React.createElement(BtnUnderline, { type: 'button' }),
            React.createElement(Separator, { className: 'wysiwyg-toolbar-divider' }),
            React.createElement(BtnNumberedList, { type: 'button' }),
            React.createElement(BtnBulletList, { type: 'button' }),
            React.createElement(Separator, { className: 'wysiwyg-toolbar-divider' }),
            React.createElement(BtnClearFormatting, { type: 'button' }),
            React.createElement(Separator, { className: 'wysiwyg-toolbar-divider' }),
            React.createElement(BtnStyles, { className: 'form-control' })
        )));
}
//# sourceMappingURL=/node_modules/react-simple-wysiwyg/lib/DefaultEditor.js.map