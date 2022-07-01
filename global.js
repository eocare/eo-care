const monthly = '39month';
const yearly = '249year';
const API_ROOT_DOMAIN = 'https://api.staging.eo.care';

pwdChangeModalListener();
loginFormStartUp();
pwdResetFormStartUp();

function loginFormStartUp() {
    let loginFormSubmitBtn = document.getElementsByClassName('submit-button-6')[0];
    // Disable Login Form Submit Button
    loginFormSubmitBtn.disabled = true; 
    // Change Login Form Submit Button Type
    loginFormSubmitBtn.type = 'button';

    // Handle Form Submission
    loginFormSubmitBtn.onclick = function (e) {
        e.preventDefault();
        const email = document.getElementById('Login-Email-Input').value;
        const pwd = document.getElementById('Login-Pwd').value;
        webLogin(email, pwd);
        return false;
    };

    document.getElementById('Login-Email-Input').addEventListener('input', loginEmailFieldChangeHandler);
    document.getElementById('Login-Pwd').addEventListener('input', loginPwdFieldChangeHandler);
}

function pwdResetFormStartUp() {
let pwdResetFormSubmitBtn = document.getElementsByClassName('pwd-reset-submit-btn')[0];

// Disable Pwd Reset Form Submit Button
pwdResetFormSubmitBtn.disabled = true;

// Change Pwd Reset Form Submit Button Type
pwdResetFormSubmitBtn.type = 'button';

// Handle Form Submission
pwdResetFormSubmitBtn.onclick = function (e) {
    e.preventDefault();
    const email = document.getElementById('pwd-reset-email-2').value;
    webPwdReset(email);
    return false;
};

document.getElementById('pwd-reset-email-2').addEventListener('input', pwdResetEmailFieldChangeHandler);
}

// API Integration
async function webLogin(email, pwd) {
    resetLoginFailedErr();
    const resp = await fetch(`${API_ROOT_DOMAIN}/web_login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        "creds": {
            "email": email,
            "password": pwd
        }
        })
    });

    if (resp.ok && resp.status === 200) {
        const data = await resp.json();
        const {management_link} = data.stripe;
        document.location.href = management_link;
    } else {
        console.log(resp.status);
        console.log("ERROR");
        showLoginFailedErr();
    }
};

function showLoginFailedErr() {
    const loginErrorLabel = document.getElementById('login-error-info-label');
    loginErrorLabel.innerText = 'Sorry, we couldn’t sign you in. Please confirm that you have already created an account and have entered the correct details below.'
    loginErrorLabel.style.display = 'block';
    // Highlight Email & Pwd Fields
    document.getElementById('Login-Email-Input').style.borderColor = '#D27A7C';
    document.getElementById('Login-Pwd').style.borderColor = '#D27A7C';
}

function resetLoginFailedErr() {
    document.getElementById('login-error-info-label').style.display = 'none';
    document.getElementById('Login-Email-Input').style.borderColor = '';
    document.getElementById('Login-Pwd').style.borderColor = '';
}

async function webPwdReset(email) {
const resp = await fetch(`${API_ROOT_DOMAIN}/password/reset/request?web=true`, {
    method: 'POST',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "email": email
    })
});

if (resp.ok && resp.status === 200) {
    // Show Password Reset Successful Confirmation
    document.querySelector('.pwd-reset-modal').style.display = 'none';
    document.querySelector('.pwd-reset-success-modal').style.display = 'block';
} else {
    console.log(resp.status);
    console.log("ERROR");
}
}

// Login Form Validation Function
var emailCheck = false;
var pwdCheck = false;
var validEmail = false;
var pwdResetEmailCheck = false;
var validPwdResetEmail = false;
var invalidEmailMsg = 'This is not a valid email address. Please try again.';

function validateEmail(email){
    return String(email)
    .toLowerCase()
    .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function loginEmailFieldChangeHandler(e) {
    let loginEmailFieldErrorLabel = document.getElementsByClassName('login-email-error-msg')[0];
    let loginFormSubmitBtn = document.getElementsByClassName('submit-button-6')[0];
    emailCheck = e.target.value.length > 0;
    if (emailCheck) {
        validEmail = validateEmail(e.target.value);
        if (!validEmail) {
        loginEmailFieldErrorLabel.innerText = invalidEmailMsg;
        loginEmailFieldErrorLabel.style.display = 'block';
        } else {
        loginEmailFieldErrorLabel.style.display = 'none';
        }
    } else {
        loginEmailFieldErrorLabel.style.display = 'none';
    }
    if(emailCheck && pwdCheck && validEmail){
        loginFormSubmitBtn.disabled = false;
    } else {
        loginFormSubmitBtn.disabled = true;
    }
}

function loginPwdFieldChangeHandler(e) {
    let loginFormSubmitBtn = document.getElementsByClassName('submit-button-6')[0];
    pwdCheck = e.target.value.length > 0;
    if(emailCheck && pwdCheck && validEmail){
        loginFormSubmitBtn.disabled = false;
    } else {
        loginFormSubmitBtn.disabled = true;
    }
}

function pwdResetEmailFieldChangeHandler(e) {
    let pwdResetEmailFieldErrorLabel = document.getElementsByClassName('pwd-reset-email-error-msg')[0];
    let pwdResetFormSubmitBtn = document.getElementsByClassName('pwd-reset-submit-btn')[0];
    pwdResetEmailCheck = e.target.value.length > 0;
    if (pwdResetEmailCheck) {
        validPwdResetEmail = validateEmail(e.target.value);
        if (!validPwdResetEmail) {
        pwdResetEmailFieldErrorLabel.innerText = invalidEmailMsg;
        pwdResetEmailFieldErrorLabel.style.display = 'block';
        } else {
        pwdResetEmailFieldErrorLabel.style.display = 'none';
        }
    } else {
        pwdResetEmailFieldErrorLabel.style.display = 'none';
    }
    if(pwdResetEmailCheck && validPwdResetEmail){
        pwdResetFormSubmitBtn.disabled = false;
    } else {
        pwdResetFormSubmitBtn.disabled = true;
    }
}

function pwdChangeModalListener() {
    const qp = new URLSearchParams(window.location.search);
    if (qp.get('action') === 'passwordReset') {
        // Show Password Change Modal
        document.querySelector('.pwd-reset-modal').style.display = 'none';
        document.querySelector('.pwd-reset-modal-wrapper').style.display = 'flex';
        document.querySelector('.pwd-change-modal').style.display = 'block';

        document.getElementById('pwd-change-2').addEventListener('input', matchPasswords);

        document.querySelector('.pwd-change-submit-btn').addEventListener('click', (e)=>{
            // On submit
        });

    } else {
        document.querySelector('.pwd-reset-modal').style.display = 'block';
        document.querySelector('.pwd-reset-success-modal').style.display = 'none';
        document.querySelector('.pwd-reset-modal-wrapper').style.display = 'none';
        document.querySelector('.pwd-change-modal').style.display = 'none';
    }
}

function pwdPolicyCheck(pwd) {
    // Should have at least 1 uppercase, 1 lowercase, and 1 number
    let uppercaseCheck = false;
    let lowercaseCheck = false;
    let numberCheck = false;
    for(let i=0; i < pwd.length; i++) {
        let curChar = pwd[i];
        uppercaseCheck = uppercaseCheck || (curChar === curChar.toUpperCase());
        lowercaseCheck = lowercaseCheck || (curChar === curChar.toLowerCase());
        numberCheck = numberCheck || (curChar == Number(curChar));
    }
    return (uppercaseCheck && lowercaseCheck && numberCheck);
}

function matchPasswords(e) {
    let pwd = document.getElementById('pwd-change-1');;
    let confirmPwd = document.getElementById('pwd-change-2');
    let errorLabel = confirmPwd.nextElementSibling;
    if (pwd.value.length > 0 && confirmPwd.value.length > 0) {
        if (pwd.value === confirmPwd.value) {
          if (pwdPolicyCheck(pwd.value)) {
            errorLabel.style.display = 'none';
          } else {
            errorLabel.innerText = "Password must contain at least one UpperCase letter, one LowerCase letter, and one Number";
            errorLabel.style.display = 'block';
          }
        } else {
            errorLabel.innerText = "Passwords do not match.";
            errorLabel.style.display = 'block';
        }
    } else {
        errorLabel.innerText = "Passwords cannot be blank.";
        errorLabel.style.display = 'block';
    }
}