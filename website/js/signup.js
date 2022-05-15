const specialCharacters = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
//Valid Email
const validForm = { email: false, password: false, name: false, userName: false, confirmPassword: false, agree: false };
//==============
const postUserContent = async () => {
  for (const input in validForm) {
    if (validForm[input] === 'error' || !validForm[input]) {
      // submitButton.disabled = true;
      createError('Something Wrong', submitButton);
      return console.log('error');
    }
  }
  // console.log(validition);
  const email = emailInput.value;
  const password = passwordInput.value;
  const fullName = nameInput.value;
  const userName = userNameInput.value;
  const userData = { email, password, fullName, userName };
  console.log(userData);
  try {
    submitButton.disabled = true;
    const data = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const info = await data.json();
    document.cookie = 'Authorization=barer ' + info.token;
    location.pathname = '/';
  } catch (err) {
    createError('Something Wrong', submitButton);
  }
};

//===========
const emailInput = document.getElementById('email');
emailInput.onblur = () => {
  if (!emailInput.value.includes('@') && !emailInput.value.includes('.')) {
    if (validForm.email === 'error') {
      return;
    }
    createError('Enter valid email!', emailInput, 'email');
  } else {
    removeError(emailInput);
    validForm.email = true;
  }
};
//valid UserName
const userNameInput = document.getElementById('userName');
userNameInput.onblur = () => {
  if (userNameInput.value.length < 5) {
    if (validForm.userName === 'error') {
      return;
    }
    createError('Username must be more than 6 characters!', userNameInput, 'userName');
  } else if (specialCharacters.test(userNameInput.value)) {
    if (validForm.userName === 'error') {
      return;
    }
    createError('Please enter valid username!', userNameInput, 'userName');
  } else {
    removeError(userNameInput);
    validForm.userName = true;
  }
};
//valid name
const nameInput = document.getElementById('name');
nameInput.onblur = () => {
  if (nameInput.value.length < 5) {
    if (validForm.name === 'error') {
      return;
    }
    createError('name must be more than 6 characters!', nameInput, 'name');
  } else if (specialCharacters.test(nameInput.value) && nameInput.value.includes('_')) {
    if (validForm.name === 'error') {
      return;
    }
    createError('Please enter valid name!', nameInput, 'name');
  } else {
    removeError(nameInput);
    validForm.name = true;
  }
};
//valid Password
const passwordInput = document.getElementById('password');
passwordInput.onblur = () => {
  if (passwordInput.value.length < 5) {
    if (validForm.password === 'error') {
      return;
    }
    createError('password must be more than 6 characters!', passwordInput, 'password');
  } else {
    removeError(passwordInput);
    validForm.password = true;
  }
};
//valid confirmpassord
const confirmPasswordInput = document.getElementById('confirmPassword');
confirmPasswordInput.onblur = () => {
  if (confirmPasswordInput.value !== passwordInput.value) {
    if (validForm.confirmPassword === 'error') {
      return;
    }
    createError('password must be confirm!', confirmPasswordInput, 'confirmPassword');
  } else {
    removeError(confirmPasswordInput);
    validForm.confirmPassword = true;
  }
};
// valid Terms
const termsInput = document.getElementById('agree');
termsInput.onchange = () => {
  if (termsInput.checked) {
    return (validForm.agree = true);
  }
  return (validForm.agree = false);
};
// submit
const submitButton = document.querySelector('button.submit');
submitButton.onclick = postUserContent;

function createError(message, element, type) {
  // console.log(message);
  const parent = element.parentElement;
  const error = document.createElement('p');
  error.className = 'error';
  error.textContent = message;
  parent.appendChild(error);
  element.classList.add('error');
  if (type) {
    validForm[type] = 'error';
  }
}
function removeError(element) {
  const parent = element.parentElement;
  element.classList.remove('error');
  const error = parent.querySelector('p');
  if (error) {
    return error.remove();
  }
  return;
}
