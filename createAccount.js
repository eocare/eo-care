
// CSS Classes
const ID_FRONT_DIV = 'license-upload-front-div';
const ID_BACK_DIV = 'license-upload-back-div';
const ID_UPLOAD_EDIT_LINK = 'license-upload-edit-link';
const ID_PREVIEW_DIV = 'license-preview-div';
const ID_LABEL_DIV = 'license-label-div';

var formDisabled = true;

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

function medicalCardCheck() {
  if (document.getElementById('already-have').checked) {
    return (document.getElementById('Medical-Card-Number').value.length > 0);
  } else {
    return (true);
  }
}

function isFieldNotEmpty(e) {
  if (e.target.value.length > 0) {
    hideFieldError(e);
    return true;
  } else {
    showFieldError(e);
  }
}

function validateEmail(email){
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function checkIfPasswordsMatch(e) {
  if (document.getElementById('pwd').value === e.target.value) {
    hideFieldError(e);
    return true;
  } else {
    showFieldError(e);
  }
}

function showFieldError(e, msg=null) {
  e.target.style.borderColor = '#D27A7C';
  e.target.nextElementSibling.style.display = 'block';
  if (msg) {
    e.target.nextElementSibling.innerText = msg;
  }
}

function hideFieldError(e) {
  e.target.style.borderColor = '';
  e.target.nextElementSibling.style.display = 'none';
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

async function isDobEligible(dob) {
  const resp = await fetch(`${API_ROOT_DOMAIN}/profile/eligible`, {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "zip": dob
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
  const yrsOld = Math.round((Date.now() - dobParsed) / (60*60*24*365*1000));
  if (yrsOld >= 21) {
    return (true);
  } else {
    return (false);
  }
}

function selectPlanById(htmlPlanId) {
  document.getElementById(htmlPlanId).checked = true;
}

function init() {
  // Get Page Query Params
  const qp = new URLSearchParams(window.location.search);
  if (qp.get('plan')) {
    selectPlanById(qp.get('plan'));
  } else {
    // Defaults to Yearly plan
    selectPlanById('249year');
  }

  // Form Event Listeners
  document.getElementById('firstname').addEventListener('blur', isFieldNotEmpty);
  document.getElementById('lastname').addEventListener('blur', isFieldNotEmpty);
  document.getElementById('phone').addEventListener('blur', isFieldNotEmpty);
  document.getElementById('zip').addEventListener('blur', async (e)=>{
    if (e.target.value.length > 0) {
      hideFieldError(e);
      // Zip Eligibility API Call
      let zipEligible = await isZipEligible(e.target.value);
      if (!zipEligible) {
        showFieldError(e, "eo isn't yet available in your area.");
      }
    } else {
      showFieldError(e, "Zip cannot be blank.");
    }
  })

  document.getElementById('dob').addEventListener('blur', (e)=>{
    if (e.target.value.length > 0) {
      hideFieldError(e);
      let dobEligible = isAtLeast21YrsOld(e.target.value);
      if (!dobEligible) {
        showFieldError(e, "Must be at least 21 years old");
      }
    } else {
      showFieldError(e, "Date Of Birth cannot be blank.");
    }
  })

  // PWD Conformation
  document.getElementById('pwd-confirmation').addEventListener('input', checkIfPasswordsMatch);

  // dragDropfileUploadStartUp();
  // fileUploadStartUp();

  window.addEventListener('load', (e)=>{
    // Disable Form Submit
    document.getElementById('create-account-submit-btn').disabled = true;
    // Set Date Of Birth Input Type to Date
    document.getElementById('dob').type = 'date';
  })
}

init();

// PRE FORM SUBMISSION VALIDATION
function validateForm() {
  const formData = new FormData(document.getElementById('create-account-form'));
  let planSelected = isPlanSelected();
  let fnameCheck = isFieldNotEmpty('firstname');
  let lnameCheck = isFieldNotEmpty('lastname');
  let phoneCheck = isFieldNotEmpty('phone');
  let zipCheck = isFieldNotEmpty('zip');
  let dobCheck = isFieldNotEmpty('dob');
  let genderCheck = document.getElementById('gender').selectedIndex !== 0;
  let validEmailCheck = false;
  let emailCheck = isFieldNotEmpty('email');
  if (emailCheck) {
    validEmailCheck = validateEmail(document.getElementById('email'));
  }

  let pwdCheck = isFieldNotEmpty('pwd');
  let pwdConfirmationCheck = isFieldNotEmpty('pwd-confirmation');
  let pwdsMatchCheck = false;
  if (pwdCheck && pwdConfirmationCheck) {
    pwdsMatchCheck = checkIfPasswordsMatch();
  }

  let idFrontUploadCheck;
  let idBackUploadCheck;
}