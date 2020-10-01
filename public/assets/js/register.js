const checkSignedInUser = () => {
  if (firebase.auth().currentUser !== null
      && firebase.auth().currentUser.displayName !== null) {
    window.location.replace(window.location.origin);
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
