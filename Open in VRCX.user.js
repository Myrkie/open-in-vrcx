// ==UserScript==
// @name         Open in VRCX
// @namespace    http://tampermonkey.net/
// @version      1.3.8
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

    let UserButton, AvatarButton, WorldButton;
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
                removeButton(AvatarButton);
                removeButton(WorldButton);
                break;
            case currentURL.includes("/home/avatar/"):
                if (!document.querySelector('#OpenAvatarinVRCX')) {
                    addAvatarButton();
                }
                removeButton(UserButton);
                removeButton(WorldButton);
                break;
            case currentURL.includes("/home/world/"):
                if (!document.querySelector('#OpenWorldinVRCX')) {
                    addWorldButton();
                }
                removeButton(UserButton);
                removeButton(AvatarButton);
                break;
            default:
                removeButton(UserButton);
                removeButton(AvatarButton);
                removeButton(WorldButton);
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
                const parsedId = window.location.href.split('/').pop();
                const uriPath = new URL(`vrcx://user/${parsedId}`);
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
                const parsedId = window.location.href.split('/').pop();
                const uriPath = new URL(`vrcx://avatar/${parsedId}`);
                window.open(uriPath, '_self');
            };

            navbarSection.appendChild(AvatarButton);
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
                const parsedId = window.location.href.split('/').pop();
                const uriPath = new URL(`vrcx://world/${parsedId}`);
                window.open(uriPath, '_self');
            };

            navbarSection.appendChild(WorldButton);
        }
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
