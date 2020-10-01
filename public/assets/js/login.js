const checkSignedInUser = async () => {
  const user = firebase.auth().currentUser;
  if (user !== null) {
    const firestoreUser = await firebase.firestore().doc(`users/${user.uid}`).get();
    if (firestoreUser.exists && firestoreUser.data().phone && firestoreUser.data().phoneVerified) {
      alert(`Dear ${user.displayName},\nYou are currently signed in as ${user.email}.\nPlease logout first before login in with another account.\nThank You!`);
      window.location.replace(window.location.origin);
    } else {
      alert(`Dear ${user.displayName},\nYou are currently signed in as ${user.email}.\nBut you need to verify your Phone Number`);
      window.location.replace(window.location.origin + '/verify');
    }
  } 
}

firebase.auth().onAuthStateChanged(checkSignedInUser);

const el = (sel) => document.querySelector(sel);
const loginForm = el('#login');
const email = el('#email');
const password = el('#password');
const submitButton = el('input[type="submit"]');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formBody = Object.fromEntries(new FormData(loginForm));
  submitButton.disabled = true;
  await firebase.auth().signInWithEmailAndPassword(formBody.email, formBody.password)
    .then((user) => window.location.replace(window.location.origin))
    .catch((error) => {
      email.value = '';
      password.value = '';
      submitButton.disabled = false;
      alert(error.code + '\n' + error.message);
    });
});
