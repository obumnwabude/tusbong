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
    .then((user) => console.log(user))
    .catch((error) => {
      email.value = '';
      password.value = '';
      submitButton.disabled = false;
      alert(error.code + '\n' + error.message);
    });
});
