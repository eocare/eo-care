function freezeBodyScroll() {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
}

function resumeBodyScroll() {
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
}

document.onload = function () {
    let modalOpeners = document.getElementsByClassName('team--member');
    let modalClosers = document.getElementsByClassName('close');
    let moreModalClosers = document.getElementsByClassName('modal-overlay');
    for (let i=0; i<modalOpeners.length; i++) {
        modalOpeners[i].addEventListener('click', freezeBodyScroll);
        modalClosers[i].addEventListener('click', resumeBodyScroll);
        moreModalClosers[i].addEventListener('click', resumeBodyScroll);
    }
};