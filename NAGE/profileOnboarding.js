function onload() {
    let supported_unions = ['iaff', 'btu', 'ethos', 'web']
    let union_type = 'iaff'
    supported_unions.forEach((union) => {
        if (window.location.pathname.includes(`/${union}/`)) {
            union_type = union
        }
    })

    const _iframeDivId = 'JotFormIFrame-230184594561459'
    document.getElementById(_iframeDivId).src =  `https://form.jotform.com/230184594561459?union=${union}`
    document.getElementById(_iframeDivId).style.display = ''
    document.getElementById(_iframeDivId).style.height = '100%'
    document.getElementById(_iframeDivId).style.width = '100%'
}

// setTimeout(onload, 800)
onload()