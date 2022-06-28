// On Page Load - Hide Login and Pwd Reset Forms
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
const API_ROOT_DOMAIN = 'https://api.staging.eo.care';

async function webLogin(email, pwd) {
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
    }
};

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
