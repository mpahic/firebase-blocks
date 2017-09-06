var fetchPosts = function(articles, postsRef) {
  document.getElementById('firebase-spinner').style.display = 'block';
  postsRef.on('child_added', function(data) {
    var author = data.val().author || 'Anonymous';

    var showAuthorName = articles.getAttribute("data-show-author-name");
    var showAuthorImage = articles.getAttribute("data-show-author-image");
    var showArticleDate = articles.getAttribute("data-show-date");
    var dateFormat = articles.getAttribute("data-date-format");
    createPostElement(articles, data.key, data.val().title, data.val().body, author,
    data.val().uid, data.val().authorPic, data.val().intro, data.val().timestamp,
    showAuthorName, showAuthorImage, showArticleDate, dateFormat);

    document.getElementById('firebase-spinner').style.display = 'none';
  });
};

function createPostElement(articles, postId, title, text, author, authorId, authorPic, intro, timestamp, showAuthorName, showAuthorImage, showArticleDate, dateFormat) {

  var headerBgColor = articles.getAttribute("data-header-bg-color");
  var articlePage = articles.getAttribute("data-article-page");
  var blogHtml = '<div class="blog-post">'+
        (showAuthorImage =="true"? '  <div class="article-photo" style="float: left" >'+
        '    <img class="img-responsive" src="'+authorPic+'" style="margin-right:20px; border-radius: 50%; height: 100px" />'+
        '  </div>': '')+
        '  <h2 class="blog-post-title"><a href="./'+articlePage+'?id='+postId+'">'+title+'</a></h2>'+
        '  <p class="blog-post-meta">'+
        (showArticleDate =="true"? '<small>'+formatDateFromPattern(dateFormat, new Date(timestamp))+'</small> ': "")+
        (showAuthorName =="true"? '<span>by '+author+'</span>': "")+
        '</p>'+
        '  <p>'+intro+'</p>'+
        '  <a href="./'+articlePage+'?id='+postId+'">Read more...</a>'+
        '  <hr>'+
        '</div>'+
        '<!-- /.blog-post -->'

  var e = document.createElement('div');
  e.innerHTML = blogHtml;

  while(e.firstChild) {
      articles.appendChild(e.firstChild);
  }
}

function formatDateFromPattern(f, date) {
    var nm = getMonthName(date);
    var nd = getDayName(date);
    f = f.replace(/yyyy/g, date.getFullYear());
    f = f.replace(/yy/g, String(date.getFullYear()).substr(2,2));
    f = f.replace(/MMM/g, nm.substr(0,3).toUpperCase());
    f = f.replace(/Mmm/g, nm.substr(0,3));
    f = f.replace(/MM\*/g, nm.toUpperCase());
    f = f.replace(/Mm\*/g, nm);
    f = f.replace(/mm/g, padLeft(String(date.getMonth()+1),'0',2));
    f = f.replace(/DDD/g, nd.substr(0,3).toUpperCase());
    f = f.replace(/Ddd/g, nd.substr(0,3));
    f = f.replace(/DD\*/g, nd.toUpperCase());
    f = f.replace(/Dd\*/g, nd);
    f = f.replace(/dd/g, padLeft(String(date.getDate()),'0',2));
    f = f.replace(/d\*/g, date.getDate());
    return f;
};

function getMonthName(date) {
    return date.toLocaleString().replace(/[^a-z]/gi,'');
};

function getDayName(date) {
    switch(date.getDay()) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
    }
};

function padLeft(string, value, size)
{
    var x = string;
    while (x.length < size) {x = value + x;}
    return x;
};
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
  document.getElementById('firebase-spinner').style.display = 'block';
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
  if (e) {
    if(key == 'authorPic') {
      e = document.getElementById("firebase-author-image");
      e.src = value;
    } else if(key == 'timestamp') {
      var datePattern = e.getAttribute("data-date-format");
      e.innerHTML = formatDateFromPattern(datePattern, new Date(value));
    } else if(e) {
      e.innerHTML = value;
    }
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
    '<button href="#" class="btn btn-danger" onclick="deleteArticle(\''+postId+'\')"><i class="glyphicon glyphicon-remove"></i></button>'+
    ' <a href="#" onclick="editArticle(\''+postId+'\')">'+title+'</a>';

  var article = document.getElementById(postId).innerHTML = html;
}

function createAdminPostElement(postId, title, text, author, authorId, authorPic, intro) {

  var html = '<li id="'+postId+'">'+
  '<button href="#" class="btn btn-danger" onclick="deleteArticle(\''+postId+'\')">Delete</button>'+
  '<a href="#" onclick="editArticle(\''+postId+'\')">'+title+'</a>'+
  '</li>';

  var articles = document.getElementById('article-list');
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

function loginGoogle() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  showAdmin();
}

function loginFacebook() {
  firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider());
  showAdmin();
}

function loginTwitter() {
  firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider());
  showAdmin();
}

function loginEmail() {
  var email = document.getElementById('admin-email').value;
  var password = document.getElementById('admin-password').value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var error = document.getElementById('admin-login-error-block');
    error.style.display = 'block';
    error.innerHTML = error.message;
  })
}

function signOut() {
  var user = firebase.auth().currentUser;

  if(user) {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
    }, function(error) {
      console.error('Sign Out Error', error);
    })
  } else {
    cancel();
  }
}

function newArticle() {
  var user = firebase.auth().currentUser;
  if(user) {
    editableId = null;
    document.getElementById('create-article').style.display = 'inline-block';
    document.getElementById('save-article').style.display = 'none';
    document.getElementById('title').innerHTML = 'Article Title';
    document.getElementById('intro').innerHTML = 'Write some intro here';
    document.getElementById('body').innerHTML = 'Body of the article...';
    document.getElementById('authorPic').src = user.photoURL;
    document.getElementById('author-name').innerHTML = user.displayName;
  }
}

function cancel() {
  newArticle();
  $('#menu-tabs a[href="#articles"]').tab('show');
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
    newArticle();
    $('#menu-tabs a[href="#articles"]').tab('show');
  }
}

var editableId = null;
function editArticle(id) {
  console.log("editing article" + id);
  var user = firebase.auth().currentUser;
  if(user) {
    fetchAdminPost(id);
    editableId = id;
    document.getElementById('create-article').style.display = 'none';
    document.getElementById('save-article').style.display = 'inline-block';

    $('#menu-tabs a[href="#new-form"]').tab('show');
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
