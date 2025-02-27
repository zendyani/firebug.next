/* See license.txt for terms of usage */

"use strict";

module.metadata = {
  "stability": "experimental"
};

var self = require("sdk/self");
var main = require("../main.js");

const { Cu, Ci } = require("chrome");
const { BaseSidePanel } = require("../chrome/baseSidePanel");
const { Class } = require("sdk/core/heritage");
const { Trace, TraceError } = require("../core/trace.js");
const { Tool } = require("dev/toolbox");
const { Locale } = require("../core/locale.js");
const { DomTree } = require("../dom/domTree.js");
const { DomProvider } = require("../dom/domProvider.js");
const { DomCache } = require("../dom/domCache.js");
const { loadSheet } = require("sdk/stylesheet/utils");
const { defer } = require("sdk/core/promise");

/**
 * @panel This object implements a main DOM panel. It displays structure
 * of the current document. The panel might be converted into DevTools SDK
 * example showing how to render remote objects (grips) by using repository
 * of registered templates {@Reps}.
 */
const DomSidePanel = Class({
/** @lends DomSidePanel */
  extends: BaseSidePanel,

  label: Locale.$STR("domPanelTitle"),
  tooltip: "DOM panel example",
  icon: "./icon-16.png",
  url: "./dom.html",

  setup: function({debuggee, frame, toolbox}) {
    BaseSidePanel.prototype.setup.apply(this, arguments);

    Trace.sysout("domSidePanel.setup;", frame);

    this.toolbox = toolbox;
    this.frame = frame;
  },

  onReady: function() {
    Trace.sysout("domSidePanel.onReady;");
  },

  supportsObject: function() {
    // xxxHonza: FIX ME
    return true;
  },

  refresh: function(actor) {
    Trace.sysout("domSidePanel.refresh; actor:", actor);

    let target = this.toolbox.target;
    target.activeTab.attachThread({}, (response, threadClient) => {
      Trace.sysout("domSidePanel.refresh; threadClient:", threadClient);

      // xxxHonza: theme applying and switch must be centralized
      // (see also theme-switcher)
      let win = this.frame.contentWindow;
      loadSheet(win, self.data.url("firebug-theme/domTree.css"), "author");
  
      var panelNode = win.document.body;

      // xxxHonza: there should be just one instance of the cache
      // (see also ConsoleOverlay).
      // The initialization should happen just once.
      let cache = new DomCache(threadClient);
      let provider = new DomProvider(cache);
      this.tree = new DomTree(provider);
      this.tree.replace(panelNode, {object: actor});
    });
  },
});

// Exports from this module
exports.DomSidePanel = DomSidePanel;
