const nav = document.querySelector('nav#navbar');
const navToggle = document.querySelector('nav#navbar input');

const checkSignedInUser = () => {
  if (firebase.auth().currentUser === null) {
    window.location.replace(window.location.origin + '/login');
  } 
}

const signOut = () => firebase.auth().signOut();

firebase.auth().onAuthStateChanged(checkSignedInUser);

window.addEventListener('scroll', (e) => {
  if (navToggle.checked) {
    navToggle.checked = false;
  }
});