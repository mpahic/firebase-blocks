mbrApp.registerPlugin("firebase-blocks",
{
	name: "firebase-blocks-plugin",
	condition: function(){
		if(mbrApp.projectSettings.firebaseSnippet)return!0
	},
	priority: 3E3,
	files: [{
		src: "firebase-plugin.js",
		publishOnly: !0
	}]
});
