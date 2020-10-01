const el = (sel) => document.querySelector(sel);
const verifyForm = el('#verify');
const main = el('main');
const submitButton = el('input[type="submit"]');
let awaitingCode = false;
let codeDigits;

const addUsersName = (name) => {
  const nameSpan = document.createElement('span');
  nameSpan.textContent = name;
  const nameP = document.createElement('p');
  nameP.classList.add('name');
  nameP.innerHTML = 'Dear ';
  nameP.appendChild(nameSpan);
  main.insertBefore(nameP, main.childNodes[3]);
}

const insertCodeDiv = () => {
  const codeDiv = document.createElement('div')
  codeDiv.id = 'code-container';
  codeDiv.classList.add('form-inputs');
  codeDiv.innerHTML = `
    <input type="tel" id="code" name="code" autocomplete="off" pattern="^\\d{6}$" required placeholder="Enter 6 digit code">
    <label for="code">Code</label>
  `;
  verifyForm.insertBefore(codeDiv, verifyForm.childNodes[3]);  
};

const removeCodeDiv = () => {
  try {
    verifyForm.removeChild(el('#code-container'));
  } catch (error) {
    console.log(error);
  }
};

const verifyPhone = () => {
  codeDigits = Math.trunc(Math.random() * 1000000);
  if (codeDigits.toString().length === 5)
    codeDigits = Number(codeDigits.toString.concat('0'));
  insertCodeDiv();
  submitButton.value = 'Verify Code';
  submitButton.disabled = false;
  alert(`Dear ${firebase.auth().currentUser.displayName},\nYour 6 digit code is:\n${codeDigits}`);
  awaitingCode = true;
};

verifyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formBody = Object.fromEntries(new FormData(verifyForm));
  submitButton.disabled = true;
  if (firebase.auth().currentUser) {
    const authUser = firebase.auth().currentUser;
    if (awaitingCode) {
      if (/^\+234[789][01]\d{8}$/.test(formBody.phone)
          && /^\d{6}$/.test(formBody.code)) {
        if (codeDigits == formBody.code) {
          await firebase.firestore()
            .doc(`users/${authUser.uid}`)
            .update({
              phone: formBody.phone,
              phoneVerified: true
            })
            .then(() => {
              alert(`Dear ${authUser.displayName},\nYour Phone Number has been verified`);
              window.location.replace(window.location.origin);
            });
          } else {
            alert('Incorrect verification code');
            window.location.reload();
          } 
      } else {
        window.location.reload();
      }
    } else {
      if (/^\+234[789][01]\d{8}$/.test(formBody.phone)) {
        try {
          const firestoreUser = await firebase.firestore().doc(`users/${authUser.uid}`).get();
          if (firestoreUser.exists) {
            if (firestoreUser.data().phone && firestoreUser.data().phoneVerified) {
              alert(`Dear ${authUser.displayName},\nYour Phone Number has been verified`);
              window.location.replace(window.location.origin);
            } else {
              verifyPhone();
            }
          } else {
            await firebase.firestore().doc(`users/${authUser.uid}`)
            .set({
              phone: formBody.phone,
              phoneVerified: false
            })
            .then(() => {
              verifyPhone();
            })
          }
        } catch (error) {
          submitButton.disabled = false;
          alert(error.code + '\n' + error.message);
          window.location.reload();
        }
      } else {
        window.location.reload();
      }
    }
  } else {
    alert('please retry');
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    addUsersName(user.displayName)
  } else {
    window.location.replace(window.location.origin + '/login');
  }
});