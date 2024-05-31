/**
 **********************************************************************
 * JigSaw - A Firefox Webextension that creates a jigsaw puzzle from
 * an image link
 **********************************************************************

   Copyright (c) 2017-2024 Arun Kunchithapatham

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

   Contributors:
   Arun Kunchithapatham - Initial Contribution
 ***********************************************************************
 *
 */

'use strict';

var browser = browser || chrome;

function saveOptions(e) {
    e.preventDefault();

    let current_settings = {
        jigsaw_default_size: document.getElementById("jigsaw_default_size").value,
        jigsaw_show_preview_image: document.getElementById("jigsaw_show_preview_image").checked
    };

    console.log(current_settings);
    browser.storage.local.set(current_settings);
}

function restoreOptions() {

    let options_list = ["jigsaw_default_size", "jigsaw_show_preview_image"];

    for (let opt=0; opt < options_list.length; opt++) {

        let opt_name = options_list[opt];

        let onGetOption = function (result) {
            if (browser.runtime.lastError) {
                console.log(browser.runtime.lastError);
            }
            else {
                let keys = Object.keys(result);
                for (let k=0; k < keys.length; k++) {
                    let opt_name = keys[k];
                    let elem_name = opt_name;
                    if (opt_name == "jigsaw_default_size") {
                        let idx = 0;
                        let selOpts = document.getElementById(elem_name);
                        for (let opt = 0; opt < selOpts.length; opt++) {
                            if (selOpts[opt].value == result.jigsaw_default_size) {
                                idx = opt;
                                break;
                            }
                        }
                        selOpts.selectedIndex = idx;
                    }
                    else if (opt_name == "jigsaw_show_preview_image") {
                        document.getElementById(elem_name).checked = result.jigsaw_show_preview_image;
                    }
                }
            }
        };
    
        let getting = browser.storage.local.get(opt_name, onGetOption);
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("jigsaw_default_size").addEventListener("change", saveOptions);
document.getElementById("jigsaw_show_preview_image").addEventListener("change", saveOptions);
