function isPlanSelected() {
  const monthly = '39month';
  const yearly = '249year';
  return document.getElementById(monthly).checked || document.getElementById(yearly).checked;
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

// API Integration
const API_ROOT_DOMAIN = 'https://api.staging.eo.care';

async function createProfile(e) {
  const resp = await fetch(`${API_ROOT_DOMAIN}/web_profile`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "profile": {
        "birth_date": dob,
        "email": email,
        "first_name": fname,
        "gender": gender,
        "last_name": lname,
        "med_card": true,
        "med_card_interest": false,
        "med_card_number": "",
        "password": pwd,
        "phone": phone,
        "zip": zip
      },
      "stripe": {
        "plan": stripePriceId
      }
    })
  });

  if (resp.ok && resp.status === 200) {
    const data = await resp.json();
    const {management_link} = data.stripe;
    document.location.href = management_link;
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
      return hideFieldError(e);
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
    showMedicalCardOptionError('Please make a selection.')
  } else {
    hideMedicalCardOptionError();
    if (document.getElementById('already-have').checked) {
      let target = extractTargetElement(e);
      if (target.value.length === 0) {
        showFieldError(e, "Medical card field cannot be empty.");
      } else {
        hideFieldError(e);
      }
    } else {
      hideFieldError(e);
    }
  }
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
  console.log(`First Name: ${isFieldEmpty('firstname')}`);
  console.log(`Last Name: ${isFieldEmpty('lastname')}`);
  console.log(`Phone: ${isFieldEmpty('phone')}`);
  console.log(`Zip: ${zipEventHandler('zip')}`);
  console.log(`Date of Birth: ${dobEventHandler('dob')}`);
  console.log(`Gender: ${genderEventHandler('gender')}`);

  console.log(`Email: ${emailEventHandler('email')}`);
  console.log(`Pwd Confirmation: ${passwordsEventHandler('pwd-confirmation')}`);

  console.log(`Plan: ${isPlanSelected()}`);
  console.log(`Medical Card Option: ${medicalCardEventHandler('Medical-Card-Number')}`);
}