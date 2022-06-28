function isPlanSelected() {
  return document.getElementById(monthly).checked || document.getElementById(yearly).checked;
}

function getPriceIdFromSelectedPlan() {
  const monthlySubs = document.getElementById(monthly);
  const yearlySubs = document.getElementById(yearly);
  if (yearlySubs.checked) {
    return (yearlySubs.dataset.priceid);
  } else if (monthlySubs.checked) {
    return (monthlySubs.priceid);
  } else {
    throw new Error('No Subscription Selected');
  }
}

function isMedicalCardOptionSelected() {
  return document.getElementById('continue-without').checked || 
  document.getElementById('like-to-have').checked || 
  document.getElementById('already-have').checked
}

function showMedicalCardOptionError(msg) {
  let errorLabel = document.getElementById('medical-card-selection-error-label');
  errorLabel.innerText = msg;
  errorLabel.style.display = 'block';
}

function hideMedicalCardOptionError() {
  let errorLabel = document.getElementById('medical-card-selection-error-label');
  errorLabel.style.display = 'none';
}

function validateEmail(email){
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function extractTargetElement(e) {
  if (e.target) {
    return e.target;
  } else {
    return document.getElementById(e);
  }
}

function showFieldError(e, msg=null) {
  let target = extractTargetElement(e);
  target.style.borderColor = '#D27A7C';
  target.nextElementSibling.style.display = 'block';
  if (msg) {
    target.nextElementSibling.innerText = msg;
  }
  return false;
}

function hideFieldError(e) {
  let target = extractTargetElement(e);
  target.style.borderColor = '';
  target.nextElementSibling.style.display = 'none';
  return true;
}

function isInterestedInMedcard(formDataMedCardClass) {
  if (formDataMedCardClass === 'like-to-have') {
    return (true);
  } else {
    return (false);
  }
}

// API Integration

async function createProfile(formData) {
  // let API_ROOT_DOMAIN = 'https://leonk.free.beeceptor.com';
  const resp = await fetch(`${API_ROOT_DOMAIN}/web_profile`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "profile": {
        "birth_date": formData.get('dob'),
        "email": formData.get('email'),
        "first_name": formData.get('firstname'),
        "gender": formData.get('gender'),
        "last_name": formData.get('lastname'),
        "med_card": formData.get('Medical-Card-Number').length > 0 ? true : false,
        "med_card_interest": isInterestedInMedcard(formData.get('medical-card')),
        "med_card_number": formData.get('Medical-Card-Number'),
        "password": formData.get('pwd'),
        "phone": formData.get('phone'),
        "zip": formData.get('zip')
      },
      "stripe": {
        "plan": getPriceIdFromSelectedPlan()
      }
    })
  });

  if (resp.ok && resp.status === 200) {
    const data = await resp.json();
    const {checkout_session_url} = data.stripe;
    console.log(checkout_session_url);
    // document.location.href = checkout_session_url;
  } else {
    console.log(resp.status);
  }
};

async function isZipEligible(zip) {
  const resp = await fetch(`${API_ROOT_DOMAIN}/profile/eligible`, {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "zip": zip
      })
  });

  if (resp.ok && resp.status === 200) {
      return true;
  } else {
      return false;
  }
}

function isAtLeast21YrsOld(dob) {
  const dobParsed = new Date(dob);
  const yrsOld = Math.round((Date.now() - dobParsed) / (60 * 60 * 24 * 365 * 1000));
  return (yrsOld >= 21) ? true : false;
}

function selectPlanById(htmlPlanId) {
  document.getElementById(htmlPlanId).checked = true;
}

// FORM FIELD VALIDATION FUNCTIONS BEGIN

function isFieldEmpty(e) {
  let target = extractTargetElement(e);
  if (target.value.length > 0) {
    return hideFieldError(e);
  } else {
    return showFieldError(e);
  }
}

async function zipEventHandler(e) {
  let target = extractTargetElement(e);
  if (target.value.length > 0) {
    hideFieldError(e);
    // Zip Eligibility API Call
    let zipEligible = await isZipEligible(target.value);
    if (!zipEligible) {
      return showFieldError(e, "eo isn't yet available in your area.");
    } else {
      return hideFieldError(e);
    }
  } else {
    return showFieldError(e, "Zip cannot be blank.");
  }
}

function dobEventHandler(e) {
  let target = extractTargetElement(e);
  if (target.value.length > 0) {
    hideFieldError(e);
    let dobEligible = isAtLeast21YrsOld(target.value);
    if (!dobEligible) {
      return showFieldError(e, "Must be at least 21 years old");
    } else {
      return hideFieldError(e);
    }
  } else {
    return showFieldError(e, "Date of birth cannot be blank.");
  }
}

function emailEventHandler(e) {
  let target = extractTargetElement(e);
  if (target.value.length > 0) {
    if (!validateEmail(target.value)) {
      return showFieldError(e, "This is not a valid email address. Please try again.");
    } else {
      return hideFieldError(e);
    }
  } else {
    return showFieldError(e, "Email can't be blank.")
  }
}

function genderEventHandler(e) {
  let target = extractTargetElement(e);
  if (target.selectedIndex === 0) {
    return showFieldError(e, "Gender cannot be blank.");
  } else {
    return hideFieldError(e);
  }
}

function passwordsEventHandler(e) {
  let confirmPwd = extractTargetElement(e);
  let pwd = document.getElementById('pwd');
  if (pwd.value.length > 0 && confirmPwd.value.length > 0) {
    if (pwd.value === confirmPwd.value) {
      if (passwordPolicyCheck(pwd.value)) {
        return hideFieldError(e);
      } else {
        return showFieldError(e, "Password must contain at least one UpperCase letter, one LowerCase letter, and one Number");
      }
    } else {
      return showFieldError(e, "Passwords do not match.");
    }
  } else {
    return showFieldError(e, "Passwords cannot be blank.")
  }
}

function medicalCardEventHandler(e) {
  let isMedCardOptionSelected = isMedicalCardOptionSelected();
  if (!isMedCardOptionSelected) {
    showMedicalCardOptionError('Please make a selection.');
    return false;
  } else {
    hideMedicalCardOptionError();
    if (document.getElementById('already-have').checked) {
      let target = extractTargetElement(e);
      if (target.value.length === 0) {
        showFieldError(e, "Medical card field cannot be empty.");
        return false;
      } else {
        hideFieldError(e);
        return true;
      }
    } else {
      hideFieldError(e);
      return true;
    }
  }
}

function passwordPolicyCheck(pwd) {
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

// FORM FIELD VALIDATION FUNCTIONS END

function onFormLoad() {
  // Change Form Submit Button Type
  document.getElementById('create-account-submit-btn').type = 'button';
  // Set Date Of Birth Input Type to Date
  document.getElementById('dob').type = 'date';
}

function init() {
  // If plan id is passed, auto select it
  // else, default to yearly plan
  const qp = new URLSearchParams(window.location.search);
  qp.get('plan') ? selectPlanById(qp.get('plan')) : selectPlanById('249year');

  // Form Event Listeners
  document.getElementById('firstname').addEventListener('input', isFieldEmpty);
  document.getElementById('lastname').addEventListener('input', isFieldEmpty);
  document.getElementById('phone').addEventListener('input', isFieldEmpty);
  document.getElementById('zip').addEventListener('blur', zipEventHandler);
  document.getElementById('dob').addEventListener('input', dobEventHandler);
  document.getElementById('pwd-confirmation').addEventListener('input', passwordsEventHandler);
  document.getElementById('Medical-Card-Number').addEventListener('blur', medicalCardEventHandler);
  document.getElementById('Medical-Card-Number').addEventListener('input', medicalCardEventHandler);
  document.getElementById('email').addEventListener('blur', emailEventHandler);
  document.getElementById('gender').addEventListener('blur', genderEventHandler);
  document.getElementById('gender').addEventListener('input', genderEventHandler);

  document.getElementById('create-account-submit-btn').addEventListener('click', (e)=>{
    e.preventDefault();
    console.log("Form Submit Intercepted.")
    // Do Form Validation Here
    validateForm();
    return false;
  })
  
  onFormLoad();
}

init();

// PRE FORM SUBMISSION VALIDATION
function validateForm() {
  let fnameCheck = isFieldEmpty('firstname');
  let lnameCheck = isFieldEmpty('lastname');
  let phoneCheck = isFieldEmpty('phone');
  let zipCheck = zipEventHandler('zip');
  let dobCheck = dobEventHandler('dob');
  let genderCheck = genderEventHandler('gender');

  let emailCheck = emailEventHandler('email');
  let pwdCheck = passwordsEventHandler('pwd-confirmation');

  let planCheck = isPlanSelected();
  let medCardCheck = medicalCardEventHandler('Medical-Card-Number');

  if (fnameCheck && lnameCheck && phoneCheck && zipCheck && dobCheck && genderCheck && emailCheck && pwdCheck && planCheck && medCardCheck) {
    // Create Web Profile
    console.log("Form Validation Successful.");
    const formData = new FormData(document.querySelector('#create-account-form'));
    createProfile(formData);
  } else {
    console.log("Form Validation Failed. Please fix the highlighted errors and resubmit.");
  }
}