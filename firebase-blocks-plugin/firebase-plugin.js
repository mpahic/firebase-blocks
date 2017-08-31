var fetchPosts = function(articles, postsRef) {
  postsRef.on('child_added', function(data) {
    var author = data.val().author || 'Anonymous';

    var showAuthorName = articles.getAttribute("data-show-author-name");
    var showAuthorImage = articles.getAttribute("data-show-author-image");
    createPostElement(articles, data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic, data.val().intro, showAuthorName, showAuthorImage);

    document.getElementById('firebase-spinner').style.display = 'none';
  });
};

function createPostElement(articles, postId, title, text, author, authorId, authorPic, intro, showAuthorName, showAuthorImage) {

  var headerBgColor = articles.getAttribute("data-header-bg-color");
  var articlePage = articles.getAttribute("data-article-page");
  var blogHtml = '<div class="panel panel-default">'+
      '  <div class="panel-heading" style="background-color: '+headerBgColor+';">'+
      (showAuthorImage =="true"? '    <div class="article-photo" style="float: left">'+
      '      <img class="img-responsive" src="'+authorPic+'" style="margin-right:20px; border-radius: 50%; height:100px" />'+
      '    </div>' : '')+
      '    <div>'+
      '      <h2>'+title+'</h2>'+
      (showAuthorName =="true"? '      <div>'+author+'</div>' : "")+
      '    </div>'+
      '  </div>'+
      '  <div class="panel-body">'+
      '    <p>'+intro+'</p>'+
      '  </div>'+
      '  <a class="btn" href="./'+articlePage+'?id='+postId+'">Read more</a>'+
      '</div>';

  var e = document.createElement('div');
  e.innerHTML = blogHtml;

  while(e.firstChild) {
      articles.appendChild(e.firstChild);
  }
}
// Article section
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function fetchPost(id) {
  var post = firebase.database().ref('posts/'+id);
  post.on('child_added', function(data) {
    insertValue(data.key, data.val());
    if(data.key === 'title') {
      document.title =data.val();
    }
    document.getElementById('firebase-spinner').style.display = 'none';
  });
};

function insertValue(key, value) {
  var e = document.getElementById("firebase-" + key);
  if(key == 'authorPic') {
    e.src = value;
  } else if(e) {
    e.innerHTML = value;
  }

}

// Admin section
var fetchAdminPosts = function(postsRef) {
  postsRef.on('child_added', function(data) {
    var author = data.val().author || 'Anonymous';
    createAdminPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic, data.val().intro);
  });
  postsRef.on('child_changed', function(data) {
    editPostElement(data.key, data.val().title, data.val().body, data.val().uid, data.val().authorPic, data.val().intro);
  });
  postsRef.on('child_removed', function(data) {
    document.getElementById(data.key).remove();
  });
};

function editPostElement(postId, title, text, authorId, authorPic, intro) {

  var html =
      '<div class="container">'+
          '<div class="row">'+
              '<div class="col-xs-12 text-xs-center">'+
                  '<h3 class="mbr-section-title"><a href="#" onclick="editArticle(\''+postId+'\')">'+title+'</a> <a href="#" class="btn btn-primary" onclick="deleteArticle(\''+postId+'\')">Delete</a></h3>'+
              '</div>'+
          '</div>'+
      '</div>';

  // Create the DOM element from the HTML.
  var article = document.getElementById(postId).innerHTML = html;
}

function createAdminPostElement(postId, title, text, author, authorId, authorPic, intro) {

  var html =
  '<div id="'+postId+'" class="mbr-section mbr-section__container mbr-section__container--middle">'+
      '<div class="container">'+
          '<div class="row">'+
              '<div class="col-xs-12 text-xs-center">'+
                  '<h5 class="mbr-section-title"><a href="#" onclick="editArticle(\''+postId+'\')">'+title+'</a> '+
                  '<a href="#" class="btn btn-white btn-black-outline" onclick="editArticle(\''+postId+'\')"><span class="mbri-edit mbr-iconfont mbr-iconfont-btn"></span>Edit</a>'+
                  '<a href="#" class="btn btn-white btn-black-outline" onclick="deleteArticle(\''+postId+'\')"><span class="mbri-delete mbr-iconfont mbr-iconfont-btn"></span>Delete</a></h5>'+
              '</div>'+
          '</div>'+
      '</div>'+
  '</div>';

  // Create the DOM element from the HTML.
  var articles = document.getElementById('articles');
  var e = document.createElement('div');
  e.innerHTML = html;

  while(e.firstChild) {
      articles.appendChild(e.firstChild);
  }
}

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

function signInOut() {
  var user = firebase.auth().currentUser;

  if(user) {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
    }, function(error) {
      console.error('Sign Out Error', error);
    })
  } else {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  form.style.display = 'none';
}

function newArticle() {
  var user = firebase.auth().currentUser;
  if(user) {
    editableId = null;
    var form = document.getElementById('form');
    form.style.display = 'block';
    document.getElementById('title').innerHTML = 'New Article';
    document.getElementById('intro').innerHTML = 'Please insert some intro';
    document.getElementById('body').innerHTML = 'Here is main article body';
    document.getElementById('authorPic').src = user.photoURL;
  }
}

function cancel() {
  var form = document.getElementById('form');
  form.style.display = 'none';
}

function save() {
  var user = firebase.auth().currentUser;

  if(user) {

    var timestamp = new Date().getTime();
    var postData = {
      author: user.displayName,
      uid: user.uid,
      body:  document.getElementById('body').innerHTML,//CKEDITOR.instances.body.getData(),
      title: document.getElementById('title').innerHTML,
      intro: document.getElementById('intro').innerHTML,
      order: -1 * timestamp,
      timestamp: timestamp,
      authorPic: user.photoURL
    };

    var newPostKey = editableId;
    if(!editableId) {
      var newPostKey = firebase.database().ref().child('posts').push().key;
    }
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + newPostKey] = postData;

    firebase.database().ref().update(updates);

    var form = document.getElementById('form');
    form.style.display = 'none';
  }
}

var editableId = null;
function editArticle(id) {
  console.log("editing article" + id);
  var user = firebase.auth().currentUser;
  if(user) {
    var form = document.getElementById('form');
    form.style.display = 'block';
    fetchAdminPost(id);
    editableId = id;
  }

}
function fetchAdminPost(id) {
  var post = firebase.database().ref('posts/'+id);
  post.on('child_added', function(data) {
    insertAdminValue(data.key, data.val());
    if(data.key = 'title') {
      document.title =data.val();
    }
  });
};

function insertAdminValue(key, value) {
  var e = document.getElementById(key);
  if(key == 'authorPic') {
    e.src = value;
  } else if(e) {
    e.innerHTML = value;
  }
}

function deleteArticle(id) {

    var user = firebase.auth().currentUser;
    if(user) {
      var post = firebase.database().ref('posts/'+id);
      post.remove();
      //document.getElementById(id).remove();
    }
}
/*
CKEDITOR.inline( 'body',{
    toolbar: [
			{ name: 'document', items: [ 'Source' ] },
			{ name: 'basicstyles', items: [ 'Bold', 'Italic' ] },
			{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
			{ name: 'links', items: [ 'Link', 'Unlink' ] },
			{ name: 'insert', items: [ 'Image', 'CodeSnippet' ] },
			{ name: 'styles', items: [ 'Format', 'Styles' ] }
		],
    extraPlugins: 'codesnippet'
} );

CKEDITOR.inline( 'intro',{
    toolbar: [
			{ name: 'basicstyles', items: [ 'Bold', 'Italic' ] },
			{ name: 'links', items: [ 'Link', 'Unlink' ] },
			{ name: 'styles', items: [ 'Format', 'Styles' ] }
		]
} );

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
*/
