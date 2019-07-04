/*
/*
 *  JigSaw is html/javascript code that creates a jigsaw from a link.
 *  It assumes that the user has provided a valid link to an image file.
 *  Copyright (C) 2017-2019 Arun Kunchithapatham
 *
 *  This file is part of JigSaw.
 *
 *   JigSaw is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  JigSaw is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with JigSaw.  If not, see <http://www.gnu.org/licenses/>.
*/

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
