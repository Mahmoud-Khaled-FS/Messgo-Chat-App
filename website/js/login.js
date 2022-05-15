const validForm = { userName: false, password: false };
const specialCharacters = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
const userNameInput = document.getElementById('userName');
// console.log(userNameInput);
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
const submitButton = document.querySelector('button.submit');
submitButton.onclick = async () => {
  if (validForm.userName === true && validForm.password === true) {
    const password = passwordInput.value;
    const userName = userNameInput.value;
    const userData = { password, userName };
    console.log(userData);
    submitButton.disabled = true;
    try {
      const data = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-type': 'application/json',
        },
      });
      // if(!data){
      //   return console.log('password not correc')
      // }
      if (data.status >= 400) {
        submitButton.disabled = false;
        return createError('SomeThing wrong', submitButton);
      }
      const info = await data.json();
      document.cookie = 'Authorization=barer ' + info.token;
      // console.log(data);
      // return console.log(info);
      location.pathname = '/';
    } catch (err) {
      createError('Something Wrong', submitButton);
    }
  }
};
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
