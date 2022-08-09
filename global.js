const monthly = '39month';
const yearly = '249year';
const API_ROOT_DOMAIN = 'https://api.staging.eo.care';

pwdChangeModalListener();
loginFormStartUp();
captureUTM();
pwdResetFormStartUp();

/**
 * Run this on Page load
 */
function loginFormStartUp() {
    let loginFormSubmitBtn = document.getElementsByClassName('submit-button-6')[0];
    // Disable Login Form Submit Button
    loginFormSubmitBtn.disabled = true; 
    // Change Login Form Submit Button Type
    loginFormSubmitBtn.type = 'button';

    // Handle Form Submission
    loginFormSubmitBtn.onclick = function (e) {
        e.preventDefault();
        _submittingState(e);
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
    _submittingState(e);
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
        const {management_link, checkout_session_url} = data.stripe;
        _successfulState('login-btn', 'Redirecting...');
        document.location.href = management_link || checkout_session_url;
    } else {
        console.log(resp.status);
        console.log("ERROR");
        showLoginFailedErr();
        _resetState('login-btn', 'Login');
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
        _resetState('pwd-reset-btn');
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
    if (qp.get('action') === 'passwordReset' && qp.get('email')) {
        // Show Password Change Modal
        document.querySelector('.pwd-reset-modal').style.display = 'none';
        document.querySelector('.pwd-reset-modal-wrapper').style.display = 'flex';
        document.querySelector('.pwd-change-modal').style.display = 'block';

        document.getElementById('pwd-change-2').addEventListener('input', matchPasswords);

        document.querySelector('.pwd-change-submit-btn').addEventListener('click', (e)=>{
            e.preventDefault();
            _submittingState(e);
            if (matchPasswords()) {
                // Get reset key from URL Query Params
                const pwdResetKey = qp.get('reset_key');
                const email = atob(qp.get('email'));
                const pwd = document.getElementById('pwd-change-2').value;
                if (pwdResetKey && email && pwd) {
                    changePwd(email, pwd, pwdResetKey);
                } else {
                    console.log(`Missing pwdRestKey or email pr Pwd`);
                }
            } else {
                console.log(`Passwords don't match`);
                _resetState('pwd-change-btn', 'Change Password');
            }
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
    let lengthCheck = pwd.length >= 8;
    for(let i=0; i < pwd.length; i++) {
        let curChar = pwd[i];
        uppercaseCheck = uppercaseCheck || (curChar === curChar.toUpperCase());
        lowercaseCheck = lowercaseCheck || (curChar === curChar.toLowerCase());
        numberCheck = numberCheck || (curChar == Number(curChar));
    }
    return (uppercaseCheck && lowercaseCheck && numberCheck && lengthCheck);
}

function matchPasswords() {
    let pwd = document.getElementById('pwd-change-1');
    let confirmPwd = document.getElementById('pwd-change-2');
    let errorLabel = confirmPwd.nextElementSibling;
    if (pwd.value.length > 0 && confirmPwd.value.length > 0) {
        if (pwd.value === confirmPwd.value) {
          if (pwdPolicyCheck(pwd.value)) {
            errorLabel.style.display = 'none';
            return (true);
          } else {
            errorLabel.innerText = "Password must be at least 8 characters long and contain at least one UpperCase letter, one LowerCase letter, and one Number";
            errorLabel.style.display = 'block';
            return (false);
          }
        } else {
            errorLabel.innerText = "Passwords do not match.";
            errorLabel.style.display = 'block';
            return (false);
        }
    } else {
        errorLabel.innerText = "Passwords cannot be blank.";
        errorLabel.style.display = 'block';
        return (false);
    }
}

async function changePwd(email, newPwd, resetKey) {
    const resp = await fetch(`${API_ROOT_DOMAIN}/password/reset/confirm`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "profile": {
                "email": email,
                "password": newPwd
              },
              "token": resetKey
        })
    });
  
    if (resp.ok && resp.status === 200) {
        _successfulState('pwd-change-btn', 'Success');
        document.getElementById('pwd-change-error-info-label').style.display = 'none';
        document.querySelector('.pwd-change-modal').style.display = 'none';
        document.querySelector('.pwd-change-success-modal').style.display = 'block';
        return true;
    } else {
        _resetState('pwd-change-btn', 'Change Password');
        document.querySelector('.pwd-change-success-modal').style.display = 'none';
        document.getElementById('pwd-change-error-info-label').innerText = 'Failed to change password. Please try again.';
        document.getElementById('pwd-change-error-info-label').style.display = 'block';
        return false;
    }
}

function captureUTM() {
    const qs = new URLSearchParams(window.location.search);
    setUTM('utm_source', qs);
    setUTM('utm_medium', qs);
    setUTM('utm_campaign', qs);
    setUTM('utm_term', qs);
    setUTM('utm_content', qs);
}

function setUTM(utm_key, qs) {
    if (localStorage.getItem(utm_key)) { // If UTM Value exists locally
        if (qs.get(utm_key)) { // If UTM Value is not null
            localStorage.setItem(utm_key, qs.get(utm_key));
        }
    } else {
        localStorage.setItem(utm_key, qs.get(utm_key));
    }
}

// Global Shared Functions
function _showFieldError(e, msg=null) {
    let target = _extractTargetElement(e);
    target.style.borderColor = '#D27A7C';
    target.nextElementSibling.style.display = 'block';
    if (msg) {
        target.nextElementSibling.innerText = msg;
    }
    return false;
}

function _hideFieldError(e) {
    let target = _extractTargetElement(e);
    target.style.borderColor = '';
    target.nextElementSibling.style.display = 'none';
    return true;
}

// Returns true if validation is passed
function _isFieldNotEmpty(e, msg=null) {
    let target = _extractTargetElement(e);
    if (target.value.length > 0) {
        return _hideFieldError(e);
    } else {
        return _showFieldError(e, msg);
    }
}

// Returns true if validation is passed
function _emailEventHandler(e, msg=null) {
    let target = _extractTargetElement(e);
    if (target.value.length > 0) {
      if (!validateEmail(target.value)) {
        return _showFieldError(e, "This is not a valid email address. Please try again.");
      } else {
        return _hideFieldError(e);
      }
    } else {
        return msg ? _showFieldError(e, msg) : _showFieldError(e, "Email can't be blank.")
    }
}

function _extractTargetElement(e) {
    if (e.target) {
      return e.target;
    } else {
      return document.getElementById(e);
    }
}

// Button States
function _submittingState(e, msg = null) {
    let target = _extractTargetElement(e);
    msg ? target.value = msg : target.value = 'Please Wait ...';
}

function _resetState(e, msg = null) {
    let target = _extractTargetElement(e);
    msg ? target.value = msg : target.value = 'Submit';
}

function _successfulState(e, msg = null) {
    let target = _extractTargetElement(e);
    msg ? target.value = msg : target.value = 'Done';
}