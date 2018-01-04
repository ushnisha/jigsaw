'use strict';

var browser = browser || chrome;

function loadJigSaw(tabId, thisURL) {
    console.log("Entered loadJigSaw at: " + new Date());

    let success = true;

    browser.tabs.insertCSS(tabId, { matchAboutBlank: false, file: "/css/jigsaw.css", runAt: "document_end"}, function() {
        browser.tabs.executeScript(tabId, { matchAboutBlank: false, file: "/content_scripts/jigsaw.js", runAt: "document_end"}, function() {
            let onSendMessage = function(response) {
                if (browser.runtime.lastError) {
                    console.log(browser.runtime.lastError);
                }
                else {
                    console.log("Response From Content Script: " + response.response);
                }
            }

            let sendMessage = browser.tabs.sendMessage(tabId, 
                                                       { jigsaw_action: "loadJigSaw", 
                                                         jigsaw_url: thisURL }, 
                                                       onSendMessage);
        });
    });
}

function loadLinkAndRunJigSaw(thisURL) {
    console.log("Entered load and Run:" + thisURL);

    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let active_tab = tabs[0];
        console.log(active_tab.id);
        loadJigSaw(active_tab.id, thisURL);
    });
}
