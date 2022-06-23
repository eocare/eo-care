
// CSS Classes
const ID_FRONT_DIV = 'license-upload-front-div';
const ID_BACK_DIV = 'license-upload-back-div';
const ID_UPLOAD_EDIT_LINK = 'license-upload-edit-link';
const ID_PREVIEW_DIV = 'license-preview-div';
const ID_LABEL_DIV = 'license-label-div';

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

function showFieldError(e) {
  e.target.style.borderColor = 'red';
}

function hideFieldError(e) {
  e.target.style.borderColor = '';
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

  // Set Date Of Birth Input Type to Date
  document.getElementById('dob').type = 'date';

  // Form Event Listeners
  document.getElementById('firstname').addEventListener('blur', isFieldNotEmpty);
  document.getElementById('lastname').addEventListener('blur', isFieldNotEmpty);
  document.getElementById('phone').addEventListener('blur', isFieldNotEmpty);
  document.getElementById('zip').addEventListener('blur', (e)=>{
    let dob = document.getElementById('dob');
    if (e.target.value.length > 0 && dob.value.length > 0) {
      // Eligibility API call
      console.log("[TODO] Eligibility API call");
    }
  })

  document.getElementById('dob').addEventListener('blur', (e)=>{
    let zip = document.getElementById('zip');
    if (e.target.value.length > 0 && zip.value.length > 0) {
      // Eligibility API call
      console.log("[TODO] Eligibility API call");
    }
  })

  // PWD Conformation
  document.getElementById('pwd-confirmation').addEventListener('input', checkIfPasswordsMatch);

  // dragDropfileUploadStartUp();
  // fileUploadStartUp();
}

init();
