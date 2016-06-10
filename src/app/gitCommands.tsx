/**
 * Registers all the git commands with the server
 */
import * as ui from "./ui";
import * as uix from "./uix";
export import commands = require("./commands/commands");
import {server} from "../socket/socketClient";
import * as CodeMirror from "codemirror";

CodeMirror.commands[commands.additionalEditorCommands.gitSoftResetFile] = function(cm: CodeMirror.EditorFromTextArea) {
    if (!cm.filePath){
        ui.notifyWarningNormalDisappear('File does not have a valid file path');
        return;
    }
    const cursor = cm.getDoc().getCursor();
    server.gitReset({ filePath: cm.filePath }).then((res) => {
        // console.log(res); // DEBUG
        cm.getDoc().setCursor(cursor);
        ui.notifySuccessNormalDisappear('Git soft reset successful');
    })
}
