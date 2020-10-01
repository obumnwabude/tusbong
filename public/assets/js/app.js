const nav = document.querySelector('nav#navbar');
const navToggle = document.querySelector('nav#navbar input');

const checkSignedInUser = async () => {
  const user = firebase.auth().currentUser;
  if (user === null) {
    window.location.replace(window.location.origin + '/login');
  } else {
    const firestoreUser = await firebase.firestore().doc(`users/${user.uid}`).get();
    if (!(firestoreUser.exists && firestoreUser.data().phone && firestoreUser.data().phoneVerified)) {
      alert(`Dear ${user.displayName},\nPlease verify your Phone Number`);
      window.location.replace(window.location.origin + '/verify');
    }
  }
}

const signOut = () => firebase.auth().signOut();

firebase.auth().onAuthStateChanged(checkSignedInUser);

window.addEventListener('scroll', (e) => {
  if (navToggle.checked) {
    navToggle.checked = false;
  }
});