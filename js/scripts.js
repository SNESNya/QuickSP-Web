var currentEngine = 'google';
var debugMode = false;
var debugCard;

function search() {
    var query = document.getElementById('search-query').value;
    
    var urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    if (urlPattern.test(query)) {
        if (!query.startsWith('http://') && !query.startsWith('https://')) {
            query = 'http://' + query;
        }
        window.location.href = query;
    } else {
        var url;
        switch (currentEngine) {
            case 'web-link':
                url = query;
                if (!url.startsWith('http')) {
                    url = 'http://' + url;
                }
                break;
            case 'google':
                url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
                break;
            case 'bing':
                url = 'https://www.bing.com/search?q=' + encodeURIComponent(query);
                break;
            case 'duckduckgo':
                url = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
                break;
            case 'wikipedia-zh':
                url = 'https://zh.wikipedia.org/wiki/' + encodeURIComponent(query);
                break;
            case 'wikipedia-en':
                url = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(query);
                break;
            case 'starquest':
                url = 'https://yhd.co/search.php?q=' + encodeURIComponent(query);
                break;
            case 'custom':
                var customUrl = localStorage.getItem('customEngineUrl');
                url = customUrl.replace('%s', encodeURIComponent(query));
                break;
        }
        window.location.href = url;
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        search();
    }
}

function changeBackground(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var imageUrl = e.target.result;
            document.body.style.backgroundImage = 'url(' + imageUrl + ')';
            localStorage.setItem('backgroundImage', imageUrl);
        };
        reader.readAsDataURL(file);
    }
}

function clearBackground() {
    document.body.style.backgroundImage = '';
    localStorage.removeItem('backgroundImage');
}

function loadBackground() {
    var backgroundImage = localStorage.getItem('backgroundImage');
    if (backgroundImage) {
        document.body.style.backgroundImage = 'url(' + backgroundImage + ')';
    }
}

function togglePopup(modalId) {
    var popup = document.getElementById(modalId);
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'flex';
    } else {
        popup.style.display = 'none';
    }
}

function setEngine(engine) {
    currentEngine = engine;
    localStorage.setItem('currentEngine', engine);
    document.querySelectorAll('.menu-section button').forEach(function(button) {
        button.classList.remove('active');
    });
    document.getElementById(engine + '-btn').classList.add('active');
}

function setTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme', 'oled-theme');
    document.body.classList.add(theme + '-theme');
    localStorage.setItem('theme', theme);
    document.querySelectorAll('.menu-section button').forEach(function(button) {
        button.classList.remove('active');
    });
    document.getElementById(theme + '-theme-btn').classList.add('active');

    applyIconColor();
}

function changeColor(elementId, styleProperty) {
    var color = event.target.value;
    document.getElementById(elementId).style[styleProperty] = color;
    localStorage.setItem(elementId + '-' + styleProperty, color);

    if (elementId === 'search-container' && styleProperty === 'backgroundColor') {
        updatePlaceholderColor(color);
    }
}

function updatePlaceholderColor(backgroundColor) {
    var rgb = hexToRgb(backgroundColor);
    var brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    var placeholderColor = brightness > 128 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    
    document.documentElement.style.setProperty('--placeholder-color', placeholderColor);
    localStorage.setItem('placeholder-color', placeholderColor);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function changePlaceholderColor() {
    var color = document.getElementById('search-placeholder-color').value;
    document.documentElement.style.setProperty('--placeholder-color', color);
    localStorage.setItem('placeholder-color', color);
}

function changePlaceholderText() {
    var text = document.getElementById('search-placeholder-text').value;
    document.getElementById('search-query').placeholder = text;
    localStorage.setItem('search-placeholder-text', text);
}

function changeSize(elementId, styleProperty) {
    var size = event.target.value + 'px';
    document.getElementById(elementId).style[styleProperty] = size;
    localStorage.setItem(elementId + '-' + styleProperty, size);
}

function changeShadowStrength() {
    var strength = document.getElementById('shadow-strength').value || '0.1';
    var size = document.getElementById('shadow-size').value || '6';
    document.getElementById('search-container').style.boxShadow = `0px 4px ${size}px rgba(0, 0, 0, ${strength})`;
    localStorage.setItem('search-container-shadow-strength', strength);
    localStorage.setItem('search-container-shadow-size', size);
}

function changeShadowSize() {
    changeShadowStrength();
}

function changePosition(elementId, styleProperty) {
    var position = event.target.value + 'px';
    document.getElementById(elementId).style[styleProperty] = position;
    localStorage.setItem(elementId + '-' + styleProperty, position);
}

function resetDefaults() {
    localStorage.removeItem('search-container-backgroundColor');
    localStorage.removeItem('search-query-color');
    localStorage.removeItem('search-button-backgroundColor');
    localStorage.removeItem('settings-button-backgroundColor');
    localStorage.removeItem('placeholder-color');
    localStorage.removeItem('search-placeholder-text');
    
    document.getElementById('search-container').style.backgroundColor = '#ffffff';
    document.getElementById('search-query').style.color = '#000000';
    document.getElementById('search-button').style.backgroundColor = '#4CAF50';
    document.getElementById('settings-button').style.backgroundColor = '#FF9800';
    document.getElementById('search-query').placeholder = '输入搜索内容...';
    document.documentElement.style.setProperty('--placeholder-color', 'rgba(0, 0, 0, 0.7)');
    applyIconColor();
}

function resetSizeDefaults() {
    localStorage.removeItem('search-container-width');
    localStorage.removeItem('search-container-height');
    localStorage.removeItem('search-container-shadow-strength');
    localStorage.removeItem('search-container-shadow-size');

    document.getElementById('search-container').style.width = '300px';
    document.getElementById('search-container').style.height = '';
    document.getElementById('search-container').style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    
    document.getElementById('search-container-width').value = 300;
    document.getElementById('search-container-height').value = 40;
    document.getElementById('shadow-strength').value = 0.1;
    document.getElementById('shadow-size').value = 6;
}

function resetPositionDefaults() {
    localStorage.removeItem('search-container-left');
    localStorage.removeItem('search-container-top');

    document.getElementById('search-container').style.left = '0px';
    document.getElementById('search-container').style.top = '0px';
    applyCustomPosition();
}

function resetAllDefaults() {
    resetDefaults();
    resetSizeDefaults();
    resetPositionDefaults();
}

function applyCustomColors() {
    var searchContainerColor = localStorage.getItem('search-container-backgroundColor');
    if (searchContainerColor) {
        document.getElementById('search-container').style.backgroundColor = searchContainerColor;
    }

    var searchQueryColor = localStorage.getItem('search-query-color');
    if (searchQueryColor) {
        document.getElementById('search-query').style.color = searchQueryColor;
    }

    var searchButtonColor = localStorage.getItem('search-button-backgroundColor');
    if (searchButtonColor) {
        document.getElementById('search-button').style.backgroundColor = searchButtonColor;
    }

    var settingsButtonColor = localStorage.getItem('settings-button-backgroundColor');
    if (settingsButtonColor) {
        document.getElementById('settings-button').style.backgroundColor = settingsButtonColor;
    }

    var placeholderColor = localStorage.getItem('placeholder-color');
    if (placeholderColor) {
        document.documentElement.style.setProperty('--placeholder-color', placeholderColor);
    }

    var searchPlaceholderText = localStorage.getItem('search-placeholder-text');
    if (searchPlaceholderText) {
        document.getElementById('search-query').placeholder = searchPlaceholderText;
    }

    var searchContainerWidth = localStorage.getItem('search-container-width');
    if (searchContainerWidth) {
        document.getElementById('search-container').style.width = searchContainerWidth;
    }

    var searchContainerHeight = localStorage.getItem('search-container-height');
    if (searchContainerHeight) {
        document.getElementById('search-container').style.height = searchContainerHeight;
    }

    var shadowStrength = localStorage.getItem('search-container-shadow-strength');
    var shadowSize = localStorage.getItem('search-container-shadow-size');
    if (shadowStrength && shadowSize) {
        document.getElementById('search-container').style.boxShadow = `0px 4px ${shadowSize}px rgba(0, 0, 0, ${shadowStrength})`;
    }
}

function changeLogo(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var logoUrl = e.target.result;
            var logoElement = document.getElementById('logo');
            if (!logoElement) {
                logoElement = document.createElement('img');
                logoElement.id = 'logo';
                document.getElementById('logo-container').appendChild(logoElement);
            }
            logoElement.src = logoUrl;
            logoElement.style.maxHeight = '100px';
            logoElement.style.maxWidth = '300px';
            localStorage.setItem('logoImage', logoUrl);
            localStorage.removeItem('logoText');
        };
        reader.readAsDataURL(file);
    }
}

function setLogoText() {
    var text = document.getElementById('logo-text').value;
    var logoElement = document.getElementById('logo');
    if (!logoElement) {
        logoElement = document.createElement('div');
        logoElement.id = 'logo';
        document.getElementById('logo-container').appendChild(logoElement);
    }
    logoElement.textContent = text;
    logoElement.style.fontSize = '24px';
    logoElement.style.fontWeight = 'bold';
    logoElement.style.color = 'inherit';
    logoElement.style.textAlign = 'center';
    logoElement.style.maxWidth = '300px';
    logoElement.style.wordWrap = 'break-word';
    localStorage.setItem('logoText', text);
    localStorage.removeItem('logoImage');
}

function clearLogo() {
    var logoElement = document.getElementById('logo');
    if (logoElement) {
        logoElement.remove();
    }
    localStorage.removeItem('logoImage');
    localStorage.removeItem('logoText');
}

function resetLogoDefaults() {
    clearLogo();
}

function applyCustomLogo() {
    var logoImage = localStorage.getItem('logoImage');
    var logoText = localStorage.getItem('logoText');
    if (logoImage) {
        var logoElement = document.getElementById('logo');
        if (!logoElement) {
            logoElement = document.createElement('img');
            logoElement.id = 'logo';
            document.getElementById('logo-container').appendChild(logoElement);
        }
        logoElement.src = logoImage;
        logoElement.style.maxHeight = '100px';
        logoElement.style.maxWidth = '300px';
    } else if (logoText) {
        var logoElement = document.getElementById('logo');
        if (!logoElement) {
            logoElement = document.createElement('div');
            logoElement.id = 'logo';
            document.getElementById('logo-container').appendChild(logoElement);
        }
        logoElement.textContent = logoText;
        logoElement.style.fontSize = '24px';
        logoElement.style.fontWeight = 'bold';
        logoElement.style.color = 'inherit';
        logoElement.style.textAlign = 'center';
        logoElement.style.maxWidth = '300px';
        logoElement.style.wordWrap = 'break-word';
    }
}

function saveDescriptionText() {
    var text = document.getElementById('description-text').value;
    var descriptionElement = document.getElementById('description');
    if (!descriptionElement) {
        descriptionElement = document.createElement('div');
        descriptionElement.id = 'description';
        document.getElementById('description-container').appendChild(descriptionElement);
    }
    descriptionElement.textContent = text;
    descriptionElement.style.fontSize = '16px';
    descriptionElement.style.color = 'inherit';
    descriptionElement.style.textAlign = 'center';
    descriptionElement.style.maxWidth = '300px';
    descriptionElement.style.wordWrap = 'break-word';
    localStorage.setItem('descriptionText', text);
    togglePopup('description-modal');
}

function clearDescription() {
    var descriptionElement = document.getElementById('description');
    if (descriptionElement) {
        descriptionElement.remove();
    }
    localStorage.removeItem('descriptionText');
}

function resetDescriptionDefaults() {
    clearDescription();
}

function applyCustomDescription() {
    var descriptionText = localStorage.getItem('descriptionText');
    if (descriptionText) {
        var descriptionElement = document.getElementById('description');
        if (!descriptionElement) {
            descriptionElement = document.createElement('div');
            descriptionElement.id = 'description';
            document.getElementById('description-container').appendChild(descriptionElement);
        }
        descriptionElement.textContent = descriptionText;
        descriptionElement.style.fontSize = '16px';
        descriptionElement.style.color = 'inherit';
        descriptionElement.style.textAlign = 'center';
        descriptionElement.style.maxWidth = '300px';
        descriptionElement.style.wordWrap = 'break-word';
    }
}

function saveCustomEngine() {
    var customEngineUrl = document.getElementById('custom-engine-url').value;
    localStorage.setItem('customEngineUrl', customEngineUrl);
    setEngine('custom');
    togglePopup('custom-engine-modal');
}

function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0 || trident > 0) {
        var warning = document.getElementById('ie-warning');
        warning.style.display = 'block';
    }
}

function applyCustomPosition() {
    var positionX = localStorage.getItem('search-container-left');
    var positionY = localStorage.getItem('search-container-top');
    if (positionX) {
        document.getElementById('search-container').style.left = positionX;
    }
    if (positionY) {
        document.getElementById('search-container').style.top = positionY;
    }
}

function changeIconColor() {
    var iconColor = document.getElementById('icon-color-select').value;
    var iconColorValue = iconColor === 'black' ? '#000000' : '#FFFFFF';
    document.documentElement.style.setProperty('--dynamic-color-on-secondary', iconColorValue);
    localStorage.setItem('icon-color', iconColor);
}

function applyIconColor() {
    var savedIconColor = localStorage.getItem('icon-color');
    if (savedIconColor) {
        var iconColorValue = savedIconColor === 'black' ? '#000000' : '#FFFFFF';
        document.documentElement.style.setProperty('--dynamic-color-on-secondary', iconColorValue);
        document.getElementById('icon-color-select').value = savedIconColor;
    }
}

function toggleDebugMode() {
    debugMode = !debugMode;
    localStorage.setItem('debugMode', debugMode);

    if (debugMode) {
        createDebugCard();
        requestAnimationFrame(updateDebugInfo);
    } else {
        removeDebugCard();
    }
}

function createDebugCard() {
    debugCard = document.createElement('div');
    debugCard.className = 'debug-card';
    debugCard.innerHTML = `
        <div>FPS: <span id="fps">NaN</span></div>
    `;
    document.body.appendChild(debugCard);
}

function removeDebugCard() {
    if (debugCard) {
        debugCard.remove();
        debugCard = null;
    }
}

function updateDebugInfo() {
    if (!debugMode) return;

    const fpsElement = document.getElementById('fps');
    let lastFrameTime = performance.now();
    let frameCount = 0;

    function calculateFPS(now) {
        frameCount++;
        const delta = now - lastFrameTime;
        if (delta >= 1000) {
            fpsElement.textContent = frameCount;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(calculateFPS);
    }

    calculateFPS(lastFrameTime);
}

window.onload = function() {
    loadBackground();
    detectIE();

    var savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('light');
    }

    var savedEngine = localStorage.getItem('currentEngine');
    if (savedEngine) {
        setEngine(savedEngine);
    } else {
        setEngine('google');
    }

    applyCustomColors();
    applyCustomLogo();
    applyCustomDescription();
    applyCustomPosition();

    var shadowStrength = localStorage.getItem('search-container-shadow-strength') || '0.1';
    var shadowSize = localStorage.getItem('search-container-shadow-size') || '6';
    document.getElementById('shadow-strength').value = shadowStrength;
    document.getElementById('shadow-size').value = shadowSize;
    changeShadowStrength();

    var savedDebugMode = localStorage.getItem('debugMode') === 'true';
    if (savedDebugMode) {
        debugMode = true;
        createDebugCard();
        requestAnimationFrame(updateDebugInfo);
    }
};