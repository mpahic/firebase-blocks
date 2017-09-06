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
	},
	{
		type:"js",
		src:"//cdn.ckeditor.com/4.7.2/standard/ckeditor.js"
	}
]
});
