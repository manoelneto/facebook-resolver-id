// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Returns a handler which will open a new window when activated.
 */
function getClickHandler() {
  return function(selection, tab) {
    chrome.extension.getBackgroundPage().console.log(arguments);


    // // The srcUrl property is only available for image elements.
    var url = 'info.html#' + selection.selectionText;

    // // Create a new window to the info page.
    chrome.windows.create({ url: url, width: window.width, height: window.height });
  };
};

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "Resolve facebook page ids",
  "type" : "normal",
  "contexts" : ["selection"],
  "onclick" : getClickHandler()
});
