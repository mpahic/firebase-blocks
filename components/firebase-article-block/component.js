mbrApp.loadComponents("firebase-blocks/components", {
  "firebase-article-block": {
    _group: "Article",
    _once: "firebase-blog-list",
    _params: {
      showArticleAuthorName: {
        type: "switch",
        title: "Show Author Name",
        default: !0
      },
      showArticleAuthorImage: {
        type: "switch",
        title: "Show Author Image",
        default: !0
      },
      showArticleIntro: {
        type: "switch",
        title: "Show Intro",
        default: !0
      },
      showArticleDate: {
        type: "switch",
        title: "Show Date",
        default: !0
      },
      dateFormat: {
        type: "text",
        title: "Date format",
        default: "dd Mmm, yyyy",
        condition: ["showArticleDate"]
      },
      dbPath: {
        type: "text",
        title: "Database path",
        default: "posts"
      },
      panelColor: {
        type: "color",
        title: "Panel Color",
        default: "#ccc"
      },
      paddingTop: {
        type: "range",
        title: "Top Padding&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
        min: 0,
        max: 4,
        step: 1,
        default: 3,
        halfWidth: !0
      },
      paddingBottom: {
        type: "range",
        title: "Bottom Padding",
        min: 0,
        max: 4,
        step: 1,
        default: 3,
        halfWidth: !0
      },
      bgColor: {
        type: "color",
        title: "Background Color",
        default: "#fff"
      }
    },
    _onParamsChange: function(b, a, c) {
      "undefined" === typeof a && b.find(".mbr-section").css({
        "padding-top": 3 * this._params.paddingTop + "rem",
        "padding-bottom": 3 * this._params.paddingBottom + "rem"
      });
      "paddingTop" != a && "paddingBottom" !=
        a || b.find(".mbr-section").css("paddingTop" == a ? "padding-top" : "padding-bottom", 3 * c + "rem")
    },
    _publishFilter: function(b, a) {
      b.find(".mbr-section").css({
        "padding-top": 3 * this._params.paddingTop + "rem",
        "padding-bottom": 3 * this._params.paddingBottom + "rem"
      });
      b.find("#firebase-title").empty();
      b.find("#firebase-intro").empty();
      b.find("#firebase-author-name").empty();
      b.find("#firebase-timestamp").empty();
      b.find("#firebase-body").empty();
    },

  }
});
