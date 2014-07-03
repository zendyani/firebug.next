/* See license.txt for terms of usage */

"use strict";

var self = require("sdk/self");

const { Cu, Ci } = require("chrome");
const { Trace } = require("../core/trace.js");
const { loadSheet } = require("sdk/stylesheet/utils");
const { EventTarget } = require("sdk/event/target");
const { Class } = require("sdk/core/heritage");
const { Xul } = require("../core/xul.js");
const { Locale } = require("../core/locale.js");
const { gDevTools } = Cu.import("resource:///modules/devtools/gDevTools.jsm", {});

// XUL Builder
const { RADIO } = Xul;

/**
 * @overlay TODO: description
 */
const OptionsOverlay = Class(
/** @lends OptionsOverlay */
{
  extends: EventTarget,

  // Initialization
  initialize: function(options) {
    Trace.sysout("optionsOverlay.initialize;", options);
  },

  onReady: function(options) {
    Trace.sysout("optionsOverlay.onReady;", options);

    let panel = options.panel;
    let doc = panel.panelWin.document;
    let win = doc.documentElement;

    // xxxHonza: Theme light should be removed eventually
    //doc.documentElement.classList.remove("theme-light");
    doc.documentElement.classList.add("theme-firebug");

    // Define template for new <radio> button: "Firebug theme".
    var radio = RADIO({
      "class": "",
      "value": "firebug",
      "label": Locale.$STR("options.label.firebugTheme")
    });

    // Render the button.
    radio.build(doc.getElementById("devtools-theme-box"));

    // xxxDjalil handle theme switch event and apply/un-apply all styles
    // applying means setting the "theme-firebug" class in all toolbox
    // iframes. If we build Firebug theme on top of the Light theme
    // we might want to keep the "theme-light" class name.
    // See also:
    // http://dxr.mozilla.org/mozilla-central/source/browser/devtools/shared/theme-switching.js

    // xxxDjalil TODO: create options.css and load.
    
    let debuggerStylesUrl = self.data.url("firebug-theme/options.css");
    loadSheet(options.panelWin, debuggerStylesUrl, "author");

    // xxxDjalil: we should also use common styles for toolbars.
    //loadSheet(options.panelWin,
    //    self.data.url("firebug-theme/toolbars.css"), "author");
  },

  destroy: function() {
  },
});

// Exports from this module
exports.OptionsOverlay = OptionsOverlay;
