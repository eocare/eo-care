async function onload() {
    let qs = new URLSearchParams(document.location.search);
    let uid = qs.get('uid') || localStorage.getItem('uid')
    let submission_id = qs.get('submission_id')
    if (uid && submission_id) {
        await saveProfileCompletionFormData(uid, submission_id)
    }
}

async function saveProfileCompletionFormData(uid, submission_id) {
    // 
    // https://us-central1-eo-care.cloudfunctions.net
    const resp = await fetch(`https://9166-122-177-44-42.ngrok.io/eo-care/us-central1/profileCompletion?uid=${uid}&submission_id=${submission_id}`, {
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