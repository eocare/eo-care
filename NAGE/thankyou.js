async function onload() {
    let qs = new URLSearchParams(document.location.search);
    let uid = qs.get('uid') || localStorage.getItem('uid')
    let submission_id = qs.get('submission_id')
    if (uid && submission_id) {
        await saveProfileCompletionFormData(uid, submission_id)
    }
}

async function saveProfileCompletionFormData(uid, submission_id) {
    const resp = await fetch(`https://0874-171-61-143-62.ngrok.io/eo-care/us-central1/profileCompletion?uid=${uid}&submission_id=${submission_id}`, {
          method: 'GET'
    });
    if (resp.ok && resp.status === 200) {
      const res = await resp.json()
      return Promise.resolve(res)
    } else {
      return Promise.reject(new Error(resp))
    }
 }

 onload()