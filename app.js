(function(a, e) {
    e.regExtension({
        name: "firebase-blocks",
        events: {
            load: function() {
                var b = this,
                    d = "";
                b.addFilter("publishHTML", function(a) {
                    var c = b.projectSettings.firebaseSnippet || "";
                    return c ? a.replace("<body>", '\n' + c + '\n  <body>') : a
                });
                b.addFilter("additionalPageSettings", function(a) {
                    var c = b.projectSettings.firebaseSnippet || "";
                    return a + ['<div class="form-group clearfix">\n<label class="col-md-3 control-label">Firebase snippet</label>\n<div class="togglebutton col-md-9">\n<label style="width: 100%;">',
                        '<input type="checkbox" id="firebaseSnippetSwitcher" ' + ("" != c ? "checked" : "") + '><span class="toggle" style="margin-top: -6px;"></span>', "</label>\n</div>", '<div class="col-md-9 col-md-offset-3 firebaseTextboxDiv" style= display:' + ("" != c ? "block" : "none") + ';><textarea rows="6" name="firebaseSnippet" placeholder="Paste your firebase snippet." class="form-control">' + c + "</textarea></div>", "</div>"
                    ].join("\n")
                });
                b.$body.on("change", "#firebaseSnippetSwitcher", function() {
                    a(this).prop("checked") ? (a(".firebaseTextboxDiv").show(),
                        a("textarea[name=firebaseSnippet]").val("" != d ? d :
"<script src=\"https://www.gstatic.com/firebasejs/4.2.0/firebase.js\"></script>"+
"\n<script>"+
"\n  // Initialize Firebase"+
"\n  // TODO: Replace with your project's customized code snippet"+
"\n  var config = {"+
"\n    apiKey: \"<API_KEY>\","+
"\n    authDomain: \"<PROJECT_ID>.firebaseapp.com\","+
"\n    databaseURL: \"https://<DATABASE_NAME>.firebaseio.com\","+
"\n    storageBucket: \"<BUCKET>.appspot.com\","+
"\n    messagingSenderId: \"<SENDER_ID>\","+
"\n  };"+
"\n  firebase.initializeApp(config);"+
"\n</script>"

)) : (d = a("textarea[name=firebaseSnippet]").val(), a("textarea[name=firebaseSnippet]").val(""), a(".firebaseTextboxDiv").hide())
                });
                b.$body.on("change", "textarea[name=firebaseSnippet]", function() {
                    "" == a(this).val() && (d = "")
                })
            }
        }
    })
})(jQuery, mbrApp);
