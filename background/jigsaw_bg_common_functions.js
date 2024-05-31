/*
/*
 *  JigSaw is html/javascript code that creates a jigsaw from a link.
 *  It assumes that the user has provided a valid link to an image file.
 *  Copyright (C) 2017-2024 Arun Kunchithapatham
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

    browser.scripting.insertCSS( {target: {tabId: tabId}, files: ["/css/jigsaw.css"] }, function() {
        browser.scripting.executeScript( {target: {tabId: tabId}, files: ["/js-utils/timer/Timer.js"] }, function() {
            browser.scripting.executeScript( {target: {tabId: tabId}, files: ["/content_scripts/jigsaw.js"] }, function() {
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

function initializeOption(opt_name, opt_value) {

    console.log(opt_name + ": " + opt_value);

    let onGettingSuccess = function(result) {
        if (browser.runtime.lastError) {
            console.log(browser.runtime.lastError);
        }
        else {
            if (Object.keys(result).length == 0) {
                let onSetting = function() {
                    if (browser.runtime.lastError) {
                        console.log(browser.runtime.lastError);
                    }
                }
                console.log({[opt_name] : opt_value});
                let setting = browser.storage.local.set({ [opt_name] : opt_value }, onSetting);
            }
        }
    }

    // Try to get an option; if it has not been set ever,
    // then try setting the option in the onGettingSuccess function
    let getting = browser.storage.local.get(opt_name, onGettingSuccess);
}

function handleInstalled(details) {

    let options_list = {jigsaw_default_size: "5",
                        jigsaw_show_preview_image: true};

    let option_keys = Object.keys(options_list);

    for (let opt=0; opt < option_keys.length; opt++) {
        let opt_name = option_keys[opt];
        let opt_value = options_list[opt_name];
        initializeOption(opt_name, opt_value);
    }

    createContextMenus();
}

browser.runtime.onInstalled.addListener(handleInstalled);
