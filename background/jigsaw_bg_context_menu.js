/*
/*
 *  JigSaw is html/javascript code that creates a jigsaw from a link.
 *  It assumes that the user has provided a valid link to an image file.
 *  Copyright (C) 2017-2020 Arun Kunchithapatham
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
