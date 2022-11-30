// CSS Classes
const RESIDENCE_DIV = 'residence-upload-front-div';
const RESIDENCE_UPLOAD_EDIT_LINK = 'residence-upload-edit-link';
const RESIDENCE_PREVIEW_DIV = 'residence-preview-div';
const RESIDENCE_ID_LABEL_DIV = 'residence-label-div';
const RESIDENCE_DRAG_TEXT = 'residence-front-drag-text'

// Upload via Input type file
function fileUploadStartUp() {
    const licenseFront = document.getElementsByClassName('w-file-upload-input')[0];
    hideAllFileUploadStates();
    licenseFront.addEventListener('change', (e)=>{
        let dropArea = document.querySelector(`.${RESIDENCE_DIV}`);
        let dragText = dropArea.querySelector(`.${RESIDENCE_DRAG_TEXT}`);
        dragText.textContent = 'Uploading...';
        console.log(`Residence Upload`);
        let file = e.target.files[0];
        idPreview(file, RESIDENCE_DIV);
        showEditLink(RESIDENCE_UPLOAD_EDIT_LINK);
    });
}

// Upload via Drag & Drop
function frontIdUploadStartUp() {
    hideEditLink(RESIDENCE_DIV);
    const dropArea = document.querySelector(`.${RESIDENCE_DIV}`);
    let dragText = dropArea.querySelector(`.${RESIDENCE_DRAG_TEXT}`);
    let file;

    let licenseFrontEditLink = document.getElementsByClassName(RESIDENCE_UPLOAD_EDIT_LINK)[0];
    // License Front Clear/Edit Link Handler
    licenseFrontEditLink.addEventListener("click", (e)=>{
        let previewDiv = dropArea.querySelector(`.${RESIDENCE_PREVIEW_DIV}`);
        previewDiv.style.background = '';
        previewDiv.dataset.file = '';
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
        dragText.textContent = 'Uploading...';
        file = event.dataTransfer.files[0];
        console.log(`Residence Proof Uploaded`);
        console.log(file);

        idPreview(file, RESIDENCE_DIV);
        showEditLink(RESIDENCE_UPLOAD_EDIT_LINK);
    });
}

function idPreview(file, parentClassName) {
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    const filesizeLimitInBytes = 4 * 1000 * 1000;
    const idParentDiv = document.querySelector(`.${parentClassName}`);
    const idPreviewDiv = idParentDiv.querySelector(`.${RESIDENCE_PREVIEW_DIV}`);
    if (validExtensions.includes(fileType) && file.size <= filesizeLimitInBytes) {
        let fileReader = new FileReader();
        fileReader.onload = ()=>{
            let fileURL = fileReader.result;
            idPreviewDiv.dataset.file = fileURL;
            idPreviewDiv.style.background = `url(${fileURL}) no-repeat`;
            idPreviewDiv.style.backgroundSize = 'cover';
            idPreviewDiv.querySelector('div').style.display = 'none';
        }
        fileReader.readAsDataURL(file);

        // Show Edit/Clear Link
        idParentDiv.querySelector(`.${RESIDENCE_ID_LABEL_DIV}`).querySelector(`.${RESIDENCE_UPLOAD_EDIT_LINK}`).style.display = '';
    } else {
        let dropArea = document.querySelector(`.${parentClassName}`);
        let dragText;
        if (parentClassName === RESIDENCE_DIV) {
            dragText = dropArea.querySelector(`.${RESIDENCE_DRAG_TEXT}`);
        }
        dragText.textContent = 'Drag & Drop to Upload File';
        // Hide Edit/Clear Link
        idParentDiv.querySelector(`.${RESIDENCE_ID_LABEL_DIV}`).querySelector(`.${RESIDENCE_UPLOAD_EDIT_LINK}`).style.display = 'none';
        alert("Please upload a .jpeg or .jpg or .png image file that is less than 4 MB.");
    }
}

// Helper Functions Begin

function showEditLink(className) {
    let editLink = document.querySelector(`.${className}`);
    editLink.style.display = '';
}

function hideEditLink(parentClassName) {
    let parent = document.querySelector(`.${parentClassName}`);
    parent.querySelector(`.${RESIDENCE_ID_LABEL_DIV}`).querySelector(`.${RESIDENCE_UPLOAD_EDIT_LINK}`).style.display = 'none';
}

function resetFrontDragText(dropArea) {
    let dragText = dropArea.querySelector(`.${RESIDENCE_DRAG_TEXT}`);
    dragText.textContent = "Drag & Drop to Upload File";
}

function dragDropfileUploadStartUp() {
    frontIdUploadStartUp();
    backIdUploadStartUp();
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

// Helper Functions End

// Initialize
dragDropfileUploadStartUp();
fileUploadStartUp();
