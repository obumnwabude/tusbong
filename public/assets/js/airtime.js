const el = (sel) => document.querySelector(sel);
const airtimeForm = el('#airtime');
const phone = el('#phone');
const amount = el('#amount');
const submitButton = el('input[type="submit"]');

airtimeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formBody = Object.fromEntries(new FormData(airtimeForm));
  if (formBody.amount >= 100 && formBody.amount <= 10000 && /^\+234[789][01]\d{8}$/.test(formBody.phone)) {
    // call airtime API
    await fetch('https://sandboxapi.fsi.ng/atlabs/airtime/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Sandbox-Key': `${await (await fetch('/sandbox')).text()}`
      },
      body: JSON.stringify({
        'recipients': [{
          'phoneNumber': formBody.phone,
          'amount': formBody.amount,
          'currencyCode': 'NGN'
        }]
      })
    }).then((response) => response.json())
    .catch((error) => console.log(error));
    alert(`Dear ${firebase.auth().currentUser.displayName},\nYou have successfully purchased NGN${formBody.amount} for ${formBody.phone}`);
  } else {
    alert('Something went wrong, please try again!');
  }
  phone.value = '';
  amount.value = '';
});

