// CSS Classes
const RESIDENCE_DIV = 'residence-upload-front-div';
const RESIDENCE_UPLOAD_EDIT_LINK = 'residence-upload-edit-link';
const RESIDENCE_PREVIEW_DIV = 'residence-preview-div';
const RESIDENCE_ID_LABEL_DIV = 'residence-label-div';
const RESIDENCE_DRAG_TEXT = 'residence-front-drag-text'

// Upload via Input type file
function residenceFileUploadStartUp() {
    const residenceInput = document.getElementsByClassName('w-file-upload-input')[2];
    hideResidenceFileUploadStates();
    residenceInput.addEventListener('change', (e)=>{
        let dropArea = document.querySelector(`.${RESIDENCE_DIV}`);
        let dragText = dropArea.querySelector(`.${RESIDENCE_DRAG_TEXT}`);
        dragText.textContent = 'Uploading...';
        console.log(`Residence Upload`);
        let file = e.target.files[0];
        residencePreview(file, RESIDENCE_DIV);
        showResidenceEditLink(RESIDENCE_UPLOAD_EDIT_LINK);
    });
}

// Upload via Drag & Drop
function residenceIdUploadStartUp() {
    hideResidenceEditLink(RESIDENCE_DIV);
    const dropArea = document.querySelector(`.${RESIDENCE_DIV}`);
    let dragText = dropArea.querySelector(`.${RESIDENCE_DRAG_TEXT}`);
    let file;

    let residenceEditLink = document.getElementsByClassName(RESIDENCE_UPLOAD_EDIT_LINK)[2];
    // License Front Clear/Edit Link Handler
    residenceEditLink.addEventListener("click", (e)=>{
        console.log('edit clicked')
        let previewDiv = dropArea.querySelector(`.${RESIDENCE_PREVIEW_DIV}`);
        previewDiv.style.background = '';
        previewDiv.dataset.file = '';
        previewDiv.querySelector('div').style.display = '';

        // clear input value
        let inputDiv =  dropArea.querySelector('.w-file-upload-default');
        inputDiv.querySelector('input').value = '';
        inputDiv.style.display = '';

        resetResidenceDragText(dropArea);
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

        residencePreview(file, RESIDENCE_DIV);
        showResidenceEditLink(RESIDENCE_UPLOAD_EDIT_LINK);
    });
}

function residencePreview(file, parentClassName) {
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

function showResidenceEditLink(className) {
    let editLink = document.querySelector(`.${className}`);
    editLink.style.display = '';
}

function hideResidenceEditLink(parentClassName) {
    let parent = document.querySelector(`.${parentClassName}`);
    parent.querySelector(`.${RESIDENCE_ID_LABEL_DIV}`).querySelector(`.${RESIDENCE_UPLOAD_EDIT_LINK}`).style.display = 'none';
}

function resetResidenceDragText(dropArea) {
    let dragText = dropArea.querySelector(`.${RESIDENCE_DRAG_TEXT}`);
    dragText.textContent = "Drag & Drop to Upload File";
}

function hideResidenceFileUploadStates() {
    // Remove unwanted Residence File Upload States 
    document.getElementsByClassName('w-file-upload-uploading')[2].remove();
    document.getElementsByClassName('w-file-upload-success')[2].remove();
    document.getElementsByClassName('w-file-upload-error')[2].remove();
}

// Helper Functions End

// Initialize
residenceIdUploadStartUp();
residenceFileUploadStartUp();
