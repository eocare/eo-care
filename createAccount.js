
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

function showFieldError(e) {
  e.target.style.borderColor = '#D27A7C';
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

  // Disable Form Submit
  document.getElementById('create-account-submit-btn').disabled = true;
  
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

  dragDropfileUploadStartUp();
  fileUploadStartUp();
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

// Upload via Input type file
function fileUploadStartUp() {
  const licenseFront = document.getElementsByClassName('w-file-upload-input')[0];
  const licenseBack = document.getElementsByClassName('w-file-upload-input')[1];
  hideAllFileUploadStates();
  licenseFront.addEventListener('change', (e)=>{
      console.log(`ID Front`);
      let file = e.target.files[0];
      idPreview(file, ID_FRONT_DIV);
      showEditLink('license-upload-edit-link');
  });

  licenseBack.addEventListener('change', (e)=>{
      document.getElementsByClassName('w-file-upload-default')[1].style.display = '';
      console.log(`ID Back`);
      console.log(e);
      let file = e.target.files[0];
      idPreview(file, ID_BACK_DIV);
      showEditLink('license-upload-edit-link');
  });
}

function hideAllFileUploadStates() {
    // Remove unwanted ID Front File Upload States 
    document.getElementsByClassName('w-file-upload-uploading')[0].remove();
    document.getElementsByClassName('w-file-upload-success')[0].remove();
    document.getElementsByClassName('w-file-upload-error')[0].remove();
    // Remove unwanted ID Back File Upload States
    document.querySelector('.w-file-upload-uploading').remove();
    document.querySelector('.w-file-upload-success').remove();
    document.querySelector('.w-file-upload-error').remove();
}

// Upload via Drag & Drop
function frontIdUploadStartUp() {
  hideEditLink(ID_FRONT_DIV);
  const dropArea = document.querySelector(`.${ID_FRONT_DIV}`);
  let dragText = dropArea.querySelector(".license-front-drag-text");
  let file;

  let licenseFrontEditLink = document.getElementsByClassName(ID_UPLOAD_EDIT_LINK)[0];
  licenseFrontEditLink.addEventListener("click", (e)=>{
    let previewDiv = dropArea.querySelector(`.${ID_PREVIEW_DIV}`);
    previewDiv.style.background = '';
    previewDiv.querySelector('div').style.display = '';

    // clear input value
    let inputDiv =  dropArea.querySelector('.w-file-upload-default');
    inputDiv.querySelector('input').value = '';
    inputDiv.style.display = '';

    resetFrontDragText(dropArea);
  });

  dropArea.addEventListener("dragover", (event)=>{
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
  });

  dropArea.addEventListener("dragleave", ()=>{
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  });

  dropArea.addEventListener("drop", (event)=>{
    event.preventDefault();
    file = event.dataTransfer.files[0];
    console.log(`Front License: Got the file`);
    console.log(file);

    idPreview(file, ID_FRONT_DIV);
    showEditLink('license-upload-edit-link');
  });
}

// Upload via Drag & Drop
function backIdUploadStartUp() {
  hideEditLink(ID_BACK_DIV);
  const dropArea = document.querySelector(`.${ID_BACK_DIV}`);
  let dragText = dropArea.querySelector(".license-back-drag-text");
  let file;

  let licenseBackEditLink = document.getElementsByClassName(ID_UPLOAD_EDIT_LINK)[1];
  licenseBackEditLink.addEventListener("click", (e)=>{
    let previewDiv = dropArea.querySelector(`.${ID_PREVIEW_DIV}`);
    previewDiv.style.background = '';
    previewDiv.querySelector('div').style.display = '';
    // clear input value
    let inputDiv =  dropArea.querySelector('.w-file-upload-default');
    inputDiv.querySelector('input').value = '';
    inputDiv.style.display = '';

    resetBackDragText(dropArea);
  });

  dropArea.addEventListener("dragover", (event)=>{
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
  });

  dropArea.addEventListener("dragleave", ()=>{
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  });

  dropArea.addEventListener("drop", (event)=>{
    event.preventDefault();
    file = event.dataTransfer.files[0];
    console.log(`Back License: Got the file`);
    console.log(file);
    showEditLink('license-upload-edit-link');
    idPreview(file, ID_BACK_DIV);
  });
}

function showEditLink(className) {
  let editLink = document.querySelector(`.${className}`);
  editLink.style.display = '';
}

function hideEditLink(parentClassName) {
  let parent = document.querySelector(`.${parentClassName}`);
  parent.querySelector(`.${ID_LABEL_DIV}`).querySelector(`.${ID_UPLOAD_EDIT_LINK}`).style.display = 'none';
}

function idPreview(file, parentClassName) {
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    const idParentDiv = document.querySelector(`.${parentClassName}`);
    const idPreviewDiv = idParentDiv.querySelector(`.${ID_PREVIEW_DIV}`);
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = ()=>{
            let fileURL = fileReader.result;
            idPreviewDiv.style.background = `url(${fileURL}) no-repeat`;
            idPreviewDiv.style.backgroundSize = 'cover';
            idPreviewDiv.querySelector('div').style.display = 'none';
        }
        fileReader.readAsDataURL(file);

        // Show Edit/Clear Link
        idParentDiv.querySelector(`.${ID_LABEL_DIV}`).querySelector(`.${ID_UPLOAD_EDIT_LINK}`).style.display = '';
    } else {
        // Hide Edit/Clear Link
        idParentDiv.querySelector(`.${ID_LABEL_DIV}`).querySelector(`.${ID_UPLOAD_EDIT_LINK}`).style.display = 'none';
        alert("Invalid file type uploaded. Please try again with a valid image file.");
    }
}

function resetBackDragText(dropArea) {
    let dragText = dropArea.querySelector(".license-back-drag-text");
    dragText.textContent = "Drag & Drop to Upload File";
}

function resetFrontDragText(dropArea) {
    let dragText = dropArea.querySelector(".license-front-drag-text");
    dragText.textContent = "Drag & Drop to Upload File";
}

function dragDropfileUploadStartUp() {
 frontIdUploadStartUp();
 backIdUploadStartUp();
}
