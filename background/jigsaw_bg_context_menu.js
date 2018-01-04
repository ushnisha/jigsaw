'use strict';

var browser = browser || chrome;

let runStr = browser.i18n.getMessage("extensionRunJigSawFromContextMenu");

// browser.contextMenus API not supported on AndroidOS
//
let gettingInfoPOS = browser.runtime.getPlatformInfo(function (info) {
    if (info.os != "android") {
        browser.contextMenus.create({
          id: "run_jigsaw",
          title: runStr,
          type: "normal",
          contexts: ["image"]
        });

        browser.contextMenus.onClicked.addListener(function(info, tab) {
            if (info.menuItemId == "run_jigsaw") {
                loadLinkAndRunJigSaw(info.srcUrl);
            }
        });
    }
});
