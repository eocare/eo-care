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

function getUTM() {
  return {
    'utm_source': localStorage.getItem('utm_source'),
    'utm_medium': localStorage.getItem('utm_medium'),
    'utm_campaign': localStorage.getItem('utm_campaign'),
    'utm_term': localStorage.getItem('utm_term'),
    'utm_content': localStorage.getItem('utm_content'),
  }
}

// API Integration

async function createProfile(formData) {
  let body = {
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
      "street-address-1": formData.get('street'),
      "street-address-2": formData.get('street-line2'),
      "city": formData.get('city'),
      "zip": formData.get('zip')
    },
    "utm": getUTM(),
    "stripe": {
      "plan": getPriceIdFromSelectedPlan()
    }
  };

  if (document.getElementById('continue-without').checked) {
    body["license"] = {
      "front_64": getLicenseFront64(),
      "back_64": getLicenseBack64()
    };
  }
  const resp = await fetch(`${API_ROOT_DOMAIN}/web_profile`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  // const data = await resp.json();
  console.log(resp.ok);
  console.log(resp.status);
  if (resp.ok && resp.status === 200) {
    // const {checkout_session_url} = data.stripe;
    // Save Session URL to local Storage
    // saveSessionURL(checkout_session_url);
    _successfulState('create-account-submit-btn', 'Subscribing...');
    let userEmail = document.getElementById('email').value;
    document.location.href = document.location.origin + '/payment-status?status=success&plan=' + getPriceIdFromSelectedPlan() + '&email=' + btoa(userEmail);
  } else {
    _resetState('create-account-submit-btn');
    if (data["errors"]["email"][0]["message"] === 'already taken') {
      showFieldError('email', 'You already have an account.');
    }
  }
};

function saveSessionURL(url) {
  if (url) {
    localStorage.setItem('EO_PAYMENT_SESSION_URL', url);
    localStorage.setItem('EO_PAYMENT_SESSION_TIMESTAMP', new Date());
  }
}

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
  const yrsOld = (Date.now() - dobParsed) / (60 * 60 * 24 * 365 * 1000);
  return (yrsOld >= 21) ? true : false;
}

function selectPlanById(htmlPlanId) {
  if (htmlPlanId == '249year') {
    setPlanCss('div-block-245', 'div-block-246');
  } else {
    setPlanCss('div-block-246', 'div-block-245');
  }
  document.getElementById(htmlPlanId).checked = true;
}

function setPlanCss(selectedClass, deselectedClass) {
    document.getElementsByClassName(selectedClass)[0].style.borderColor = 'rgb(0,0,0)';
    document.getElementsByClassName(selectedClass)[0].style.backgroundColor = 'rgb(211, 207, 203)';

    document.getElementsByClassName(deselectedClass)[0].style.borderColor = 'rgba(0,0,0,0)';
    document.getElementsByClassName(deselectedClass)[0].style.backgroundColor = 'rgb(248, 246, 243)';
}

// FORM FIELD VALIDATION FUNCTIONS BEGIN

function isFieldNotEmpty(e) {
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

function phoneValidator(e) {
  let phone = extractTargetElement(e);
  if (!isFieldNotEmpty(e)) {
    return showFieldError(e, 'Phone Number Field cannot be blank.')
  } else {
    if (phone.value.length !== 10) {
      return showFieldError(e, 'Phone Number should be 10 digits long.')
    } else {
      return hideFieldError(e);
    }
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
        return showFieldError(e, "Password must be at least 8 characters long and contain at least one UpperCase letter, one LowerCase letter, and one Number");
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
  let atleast8Characters = pwd.length >= 8;
  for(let i=0; i < pwd.length; i++) {
    let curChar = pwd[i];
    uppercaseCheck = uppercaseCheck || (curChar === curChar.toUpperCase());
    lowercaseCheck = lowercaseCheck || (curChar === curChar.toLowerCase());
    numberCheck = numberCheck || (curChar == Number(curChar));
  }
  return (uppercaseCheck && lowercaseCheck && numberCheck && atleast8Characters);
}

function licenseValidator() {
  if (document.getElementById('continue-without').checked) {
    const licenseFrontPreviewDiv = document.querySelector('.license-upload-front-div')
    .querySelector('.license-preview-div');
    const licenseBackPreviewDiv = document.querySelector('.license-upload-back-div')
    .querySelector('.license-preview-div');
    if (licenseFrontPreviewDiv.dataset.file && licenseBackPreviewDiv.dataset.file) {
      return true;
    } else {
      if (!licenseFrontPreviewDiv.dataset.file) {
        showFieldError('license-upload-front-div', 'ID is required');
      }
      if (!licenseBackPreviewDiv.dataset.file) {
        showFieldError('license-upload-back-div', 'ID is required');
      }
      return false;
    }
  } else {
    return true;
  }
}

// FORM FIELD VALIDATION FUNCTIONS END 

function getLicenseFront64() {
  return document.querySelector('.license-upload-front-div')
  .querySelector('.license-preview-div')
  .dataset
  .file;
}

function getLicenseBack64() {
  return document.querySelector('.license-upload-back-div')
  .querySelector('.license-preview-div')
  .dataset
  .file;
}

function onFormLoad() {
  // Change Form Submit Button Type
  document.getElementById('create-account-submit-btn').type = 'button';
  // Set Date Of Birth Input Type to Date
  document.getElementById('dob').type = 'date';

  // Limit Input Image Types and allow Capturing from Camera
  const fileAcceptanceCriteria = '.jpg, .jpeg, .png, ;capture=camera';
  document.getElementById('license-front').accept = fileAcceptanceCriteria;
  document.getElementById('license-back').accept = fileAcceptanceCriteria;
}

function init() {
  // If plan id is passed, auto select it
  // else, default to yearly plan
  const qp = new URLSearchParams(window.location.search);
  qp.get('plan') ? selectPlanById(qp.get('plan')) : selectPlanById('249year');

  // Form Event Listeners
  document.getElementById('firstname').addEventListener('input', isFieldNotEmpty);
  document.getElementById('lastname').addEventListener('input', isFieldNotEmpty);
  document.getElementById('phone').addEventListener('input', phoneValidator);
  document.getElementById('phone').addEventListener('blur', phoneValidator);
  document.getElementById('street').addEventListener('input', isFieldNotEmpty);
  document.getElementById('city').addEventListener('input', isFieldNotEmpty);
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
    _submittingState(e);
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
  let fnameCheck = isFieldNotEmpty('firstname');
  let lnameCheck = isFieldNotEmpty('lastname');
  let phoneCheck = phoneValidator('phone');
  let streetAddressCheck = isFieldNotEmpty('street');
  let cityCheck = isFieldNotEmpty('city');
  let zipCheck = zipEventHandler('zip');
  let dobCheck = dobEventHandler('dob');
  let genderCheck = genderEventHandler('gender');

  let emailCheck = emailEventHandler('email');
  let pwdCheck = passwordsEventHandler('pwd-confirmation');

  let planCheck = isPlanSelected();
  let medCardCheck = medicalCardEventHandler('Medical-Card-Number');

  let licenseCheck = licenseValidator();

  if (fnameCheck && lnameCheck && phoneCheck && zipCheck && dobCheck && genderCheck 
    && emailCheck && pwdCheck && planCheck && medCardCheck && licenseCheck && streetAddressCheck && cityCheck) {
    // Create Web Profile
    console.log("Form Validation Successful.");
    const formData = new FormData(document.querySelector('#create-account-form'));
    createProfile(formData);
  } else {
    _resetState('create-account-submit-btn');
    console.log("Form Validation Failed. Please fix the highlighted errors and resubmit.");
    // document.getElementById('create-account-submit-btn').innerText = 'Continue to payment'
  }
}