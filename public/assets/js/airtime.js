const el = (sel) => document.querySelector(sel);
const airtimeForm = el('#airtime');
const phone = el('#phone');
const amount = el('#amount');
const submitButton = el('input[type="submit"]');

airtimeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formBody = Object.fromEntries(new FormData(airtimeForm));
  if (formBody.amount >= 100 && formBody.amount <= 10000 && /^\+234[789][01]\d{8}$/.test(formBody.phone)) {
    alert(`Dear ${firebase.auth().currentUser.displayName},\nYou have successfully purchased NGN${formBody.amount} for ${formBody.phone}`);
  } else {
    alert('Something went wrong, please try again!');
  }
  phone.value = '';
  amount.value = '';
});