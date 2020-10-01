const checkSignedInUser = async () => {
  const user = firebase.auth().currentUser;
  if (user !== null && user.displayName !== null) {
    const firestoreUser = await firebase.firestore().doc(`users/${user.uid}`).get();
    if (firestoreUser.exists && firestoreUser.data().phone && firestoreUser.data().phoneVerified) {
      alert(`Dear ${user.displayName},\nYou are currently signed in as ${user.email}.\nPlease logout first before creating a new account.\nThank You!`);
      window.location.replace(window.location.origin);
    } else {
      alert(`Dear ${user.displayName},\nYou are currently signed in as ${user.email}.\nBut you need to verify your Phone Number`);
      window.location.replace(window.location.origin + '/verify');
    }
  } 
}

firebase.auth().onAuthStateChanged(checkSignedInUser);

const el = (sel) => document.querySelector(sel);
const regForm = el('#register');
const name = el('#name');
const email = el('#email');
const password = el('#password');
const confirmPassword = el('#confirm_password');
const submitButton = el('input[type="submit"]');

const clearFields = () => 
  [name, email, password, confirm_password].forEach((node) => node.value = '');

regForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formBody = Object.fromEntries(new FormData(regForm));
  if (formBody.password !== formBody.confirm_password) {
    document.querySelector('#password').value = '';
    document.querySelector('#confirm_password').value = '';
    alert('Passwords donot match');
  } else {
    submitButton.disabled = true;
    await firebase.auth().createUserWithEmailAndPassword(formBody.email, formBody.password)
      .then((user) => firebase.auth().currentUser.updateProfile({
        displayName: formBody.name
      }))
      .then(() => window.location.assign(window.location.origin + '/verify'))
      .catch((error) => {
        clearFields();
        submitButton.disabled = false;
        alert(error.code + '\n' + error.message);
      });
  }
});
