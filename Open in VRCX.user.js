// ==UserScript==
// @name         Open in VRCX
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @updateURL    https://raw.githubusercontent.com/Myrkie/open-in-vrcx/mistress/Open%20in%20VRCX.user.js?
// @downloadURL  https://raw.githubusercontent.com/Myrkie/open-in-vrcx/mistress/Open%20in%20VRCX.user.js?
// @description  Adds an "Open in VRCX" button to user profiles and avatars;
// @icon         https://www.google.com/s2/favicons?domain=vrchat.com
// @author       Myrkur
// @match        https://vrchat.com/*
// @match        https://vrchat.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let UserButton, AvatarButton, WorldButton, GroupButton, SwapButton;
    let debounceTimer;

    function debounce(fn, delay) {
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function addButtonToNavbar() {
        const currentURL = window.location.href;
        switch (true) {
            case currentURL.includes("/home/user/"):
                if (!document.querySelector('#OpenUserinVRCX')) {
                    addUserButton();
                }
                removeButton(GroupButton);
                removeButton(AvatarButton);
                removeButton(WorldButton);
                removeButton(SwapButton);
                break;
            case currentURL.includes("/home/avatar/"):
                if (!document.querySelector('#OpenAvatarinVRCX')) {
                    addAvatarButton();
                    addAvatarSwapButton();
                }
                removeButton(GroupButton);
                removeButton(UserButton);
                removeButton(WorldButton);
                break;
            case currentURL.includes("/home/world/"):
                if (!document.querySelector('#OpenWorldinVRCX')) {
                    addWorldButton();
                }
                removeButton(GroupButton);
                removeButton(UserButton);
                removeButton(AvatarButton);
                removeButton(SwapButton);
                break;
            case currentURL.includes("/home/group/"):
                if (!document.querySelector('#OpenGroupinVRCX')) {
                    addGroupButton();
                }
                removeButton(WorldButton);
                removeButton(UserButton);
                removeButton(AvatarButton);
                removeButton(SwapButton);
                break;
            default:
                removeButton(GroupButton);
                removeButton(UserButton);
                removeButton(AvatarButton);
                removeButton(WorldButton);
                removeButton(SwapButton);
                break;
        }
    }

    function removeButton(button) {
        if (button) {
            button.remove();
        }
    }

    function addUserButton() {
        let navbarSection = document.querySelector('.navbar-section.left-nav');

        if (navbarSection) {
            UserButton = document.createElement('button');
            UserButton.id = 'OpenUserinVRCX';
            UserButton.innerText = 'Open User in VRCX';

            UserButton.classList.add('p-2', 'btn', 'navbar-btn', 'medium');
            addSVGIcon(UserButton);

            UserButton.onclick = function() {
                const userId = extractId(window.location.href, 'usr');
                if (!userId) {
                    console.error("User ID not found in URL");
                    return;
                }
                const uriPath = new URL(`vrcx://user/${userId}`);
                window.open(uriPath, '_self');
            };

            navbarSection.appendChild(UserButton);
        }
    }

    function addAvatarButton() {
        let navbarSection = document.querySelector('.navbar-section.left-nav');

        if (navbarSection) {
            AvatarButton = document.createElement('button');
            AvatarButton.id = 'OpenAvatarinVRCX';
            AvatarButton.innerText = 'Open Avatar in VRCX';

            AvatarButton.classList.add('p-2', 'btn', 'navbar-btn', 'medium');
            addSVGIcon(AvatarButton);
            AvatarButton.onclick = function() {
                const avatarId = extractId(window.location.href, 'avtr');
                if (!avatarId) {
                    console.error("Avatar ID not found in URL");
                    return;
                }
                const uriPath = new URL(`vrcx://avatar/${avatarId}`);
                window.open(uriPath, '_self');
            };

            navbarSection.appendChild(AvatarButton);
        }
    }

    function addAvatarSwapButton() {
        let navbarSection = document.querySelector('.navbar-section.left-nav');

        if (navbarSection) {
            SwapButton = document.createElement('button');
            SwapButton.id = 'SwapAvatarinVRCX';
            SwapButton.innerText = 'Swap to Avatar in VRChat';

            SwapButton.classList.add('p-2', 'btn', 'navbar-btn', 'medium');
            addSVGIcon(SwapButton);
            SwapButton.onclick = function() {
                const avatarId = extractId(window.location.href, 'avtr');
                if (!avatarId) {
                    console.error("Avatar ID not found in URL");
                    return;
                }
                const uriPath = new URL(`vrcx://switchavatar/${avatarId}`);
                window.open(uriPath, '_self');
            };

            navbarSection.appendChild(SwapButton);
        }
    }

    function addWorldButton() {
        let navbarSection = document.querySelector('.navbar-section.left-nav');

        if (navbarSection) {
            WorldButton = document.createElement('button');
            WorldButton.id = 'OpenWorldinVRCX';
            WorldButton.innerText = 'Open World in VRCX';

            WorldButton.classList.add('p-2', 'btn', 'navbar-btn', 'medium');
            addSVGIcon(WorldButton);

            WorldButton.onclick = function() {
                const worldId = extractId(window.location.href, 'wrld');
                if (!worldId) {
                    console.error("World ID not found in URL");
                    return;
                }
                const uriPath = new URL(`vrcx://world/${worldId}`);
                window.open(uriPath, '_self');
            };

            navbarSection.appendChild(WorldButton);
        }
    }

    function addGroupButton() {
        let navbarSection = document.querySelector('.navbar-section.left-nav');

        if (navbarSection) {
            GroupButton = document.createElement('button');
            GroupButton.id = 'OpenGroupinVRCX';
            GroupButton.innerText = 'Open Group in VRCX';

            GroupButton.classList.add('p-2', 'btn', 'navbar-btn', 'medium');
            addSVGIcon(GroupButton);

            GroupButton.onclick = function() {
                const groupId = extractId(window.location.href, 'grp');
                if (!groupId) {
                    console.error("Group ID not found in URL");
                    return;
                }
                const uriPath = new URL(`vrcx://group/${groupId}`);
                window.open(uriPath, '_self');
            };

            navbarSection.appendChild(GroupButton);
        }
    }

    function extractId(url, idType) {
        if(idType === "usr" && getLegacyID(url).length === 10){
            return getLegacyID(url);
        }
        let expression = new RegExp(`(${idType}_[a-zA-Z0-9-]+)(?:/|$)`);
        const match = url.match(expression);
        return match ? match[1] : null;
    }

    function getLegacyID(input) {
        const parts = input.split("/");
        return parts.pop();
    }

    function addSVGIcon(button) {
        let vrcsettingsSVG = document.querySelector('.svg-inline--fa.fa-gears.fa-lg.css-1efeorg.e9fqopp0');
        if (vrcsettingsSVG) {
            let svgClone = vrcsettingsSVG.cloneNode(true);
            svgClone.style.marginRight = '8px';
            button.insertBefore(svgClone, button.firstChild);
        }
    }

    const observer = new MutationObserver(debounce((mutations) => {
        addButtonToNavbar();
    }, 500));

    observer.observe(document.querySelector('.navbar-section.left-nav') || document.body, { childList: true, subtree: true });

    window.addEventListener('load', addButtonToNavbar);
})();
