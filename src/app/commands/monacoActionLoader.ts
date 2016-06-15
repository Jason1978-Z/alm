import * as types from "../../common/types";

/** Addons. These must be loaded before the function below is ever called so loaded here 🌹 */
import * as gitStatus from "../monaco/addons/gitStatus";
import * as jumpy from "../monaco/addons/jumpy";
import * as gitReset from "../monaco/addons/gitReset";
import * as htmlToTsx from "../monaco/addons/htmlToTsx";
const ensureImport =
    gitStatus
    || jumpy
    || gitReset
    || htmlToTsx
    ;

/**
 * This creates a dummy monaco editor just to get its actions
 */
export function getActions(): types.MonacoActionInformation[] {
    const elt = document.createElement('div');
    const editor = monaco.editor.create(elt,{},[]);

    // WARNING: This isn't documented or well exposed
    // but this is what `quickCommand.ts` (the built in command pallet) uses
    // It uses its on (injected) version but fortunately its on the editor as well
    const keybindingService = (editor as any)._keybindingService;
    // console.log(keybindingService); // DEBUG

    const actions = editor.getActions();

    let result = actions.map(a=>{
        // can have multiple (but in my experience they only had singles or 0)
        let keyboards = keybindingService.lookupKeybindings(a.id).map(k => keybindingService.getLabelFor(k));
        let keyboard = keyboards[0];

        // if there was any keyboard
        // map to it look nice for us
        // We don't actually need to use these bindings other than the display it (as trigger is done by `id`).
        let kbd = null;
        if (keyboard) {
            kbd = keyboard
                .replace('UpArrow','Up')
                .replace('DownArrow','Down')
                .replace('LeftArrow','Left')
                .replace('RightArrow','Right')
                ;
        }

        return {
            label: a.label,
            id: a.id,
            kbd: kbd
        }
    });

    editor.dispose();
    elt.remove();
    return result;
}
