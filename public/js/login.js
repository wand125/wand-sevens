const login = () => {
  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    console.log(error);
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log(user);
      location.href = 'game.html';
    } else {
      // User is signed out.
      // ...
    }
    // ...
  });
}
