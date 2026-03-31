function showInfo() {
    if (document.getElementById('info').style.display == 'block') {
        document.getElementById('info').style.display = 'none';
    } else {
        document.getElementById('info').style.display = 'block';
    }
};

function showSettings() {
    if (document.getElementById('settings').style.display == 'block') {
        document.getElementById('settings').style.display = 'none';
    } else {
        document.getElementById('settings').style.display = 'block';
    }
};

function updateSettings() {
    let showWikiLogo = document.getElementById('showWikiLogo').checked;
    let showBrain = document.getElementById('showBrain').checked;
    let background = document.getElementById('background').value;

    let settingsParams = new URLSearchParams({
        'wikiLogo': showWikiLogo,
        'brain': showBrain,
        'background': background
    });

    globalThis.history.pushState('', '',
        `${globalThis.location.origin}${globalThis.location.pathname}?${settingsParams}`);
}

function loadSettings() {
    let settingsParams = new URLSearchParams(globalThis.location.search);

    for (const [key, value] of settingsParams.entries()) {
        if (key === 'wikiLogo') {
            document.getElementById('showWikiLogo').checked = (value === 'true')
        } else if (key === 'brain') {
            document.getElementById('showBrain').checked = (value === 'true')
        } else if (key === 'background') {
            document.getElementById('background').value = value
        }
    }
}