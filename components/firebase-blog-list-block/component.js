mbrApp.loadComponents("firebase-blocks/components", {
  "firebase-blog-list-block": {
    _group: "Article",
    _once: "firebase-blog-list",
    _params: {
      showTitle: {
        type: "switch",
        title: "Show Title",
        default: !0
      },
      showCaption: {
        type: "switch",
        title: "Show Caption",
        default: !0
      },
      articlesNumber: {
        type: "range",
        title: "Number of Articles",
        min: 3,
        max: 100,
        step: 1,
        default: 10
      },
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
      showReadMore: {
        type: "switch",
        title: "Show Read more..",
        default: !0
      },
      showOlderPosts: {
        type: "switch",
        title: "Show Older Posts",
        default: !0
      },
      dbPath: {
        type: "text",
        title: "Database path",
        default: "posts"
      },
      showSideBar: {
        type: "switch",
        title: "Show Side Bar",
        default: !0
      },
      panelColor: {
        type: "color",
        title: "Panel Color",
        default: "#ccc"
      },
      articlePage: {
        type: "text",
        title: "Article Page",
        default: "article.html"
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
      b.find(".blog-post").remove();
    },
    title: "Blog posts",
    caption: "<p>Mobirise firebase plugin allows for you to connect to Firebase web application easily, and provides other functionalities. This particular block lists all of the articles from the realtime database.</p>",

  }
});
