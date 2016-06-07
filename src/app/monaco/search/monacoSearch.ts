/**
 * The best way to understand what is going on is to review the `find` module in monaco
 * https://github.com/Microsoft/vscode/tree/385412e89f610aaa5dc7d6a3727f45e048e37c7e/src/vs/editor/contrib/find
 */
/** Some types */
type Editor = monaco.editor.ICommonCodeEditor;

declare global {
    module monaco {
        module editor {
            interface ICommonCodeEditor {
                _findController: CommonFindController;
            }
        }
    }
}

/**
 * Mostly providing a typed API on top of `search`
 */
export let commands = {
    search: (cm: Editor, query: FindOptions) => startSearch(cm, query),
    hideSearch: (cm: Editor) => hideSearch(cm),
    findNext: (cm: Editor, query: FindOptions) => findNextIfNotAlreadyDoing(cm, query),
    findPrevious: (cm: Editor, query: FindOptions) => findPreviousIfNotAlreadyDoing(cm, query),
    replaceNext: (cm: Editor, newText: string) => simpleReplaceNext(cm, newText),
    replacePrevious: (cm: Editor, newText: string) => simpleReplacePrevious(cm, newText),
    replaceAll: (cm: Editor, newText: string) => simpleReplaceAll(cm, newText),
}

const startSearch = (editor: Editor, query: FindOptions) => {
    const ctrl = getSearchCtrl(editor);
    if (!ctrl.getState().isRevealed) {
        ctrl.start({
            forceRevealReplace: true,
            seedSearchStringFromSelection: false,
            seedSearchScopeFromSelection: false,
            shouldFocus: FindStartFocusAction.NoFocusChange,
            shouldAnimate: false,
        });
    }
    ctrl.setSearchString(query.query);
    // TODO: mon
    // set other options as well
};
const hideSearch = (editor: Editor) => {
    const ctrl = getSearchCtrl(editor);
    ctrl.closeFindWidget();
};
const findNextIfNotAlreadyDoing = (editor: Editor, query: FindOptions) => {
    const ctrl = getSearchCtrl(editor);
    if (!ctrl.getState().isRevealed) {
        startSearch(editor,query);
    }
    else {
        ctrl.moveToNextMatch();
    }
}
const findPreviousIfNotAlreadyDoing = (editor: Editor, query: FindOptions) => {
    const ctrl = getSearchCtrl(editor);
    if (!ctrl.getState().isRevealed) {
        startSearch(editor,query);
    }
    else {
        ctrl.moveToPrevMatch();
    }
};
const simpleReplaceNext = (editor: Editor, newText:string) => {
    const ctrl = getSearchCtrl(editor);

    // Set new text
    hackySetReplaceText(ctrl, newText);

    // trigger the replace action
    ctrl.replace();
};
/** TODO: mon */
const simpleReplacePrevious: any = () => null;

const simpleReplaceAll = (editor: Editor, newText: string) => {
    const ctrl = getSearchCtrl(editor);

    // Set new text
    hackySetReplaceText(ctrl,newText);

    // trigger the replace all
    ctrl.replaceAll();
};


/**
 * Our interactions with monaco
 */
const getSearchCtrl = (editor: Editor) => {
    return CommonFindController.getFindController(editor);
};
const hackySetReplaceText = (ctrl: CommonFindController, newText: string) => {
    // HACK to inject at new text:
    (ctrl.getState() as any)._replaceString = newText;
}

import {CommonFindController, FindStartFocusAction} from "./findController";
