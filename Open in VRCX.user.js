// ==UserScript==
// @name         Open in VRCX
// @namespace    http://tampermonkey.net/
// @version      1.3.5
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
    let UserButton;
    let AvatarButton;

    function addButtonToNavbar() {
        const currentURL = window.location.href;


        switch (true) {
            case currentURL.includes("/home/user/"):
                addUserButton();
                if(AvatarButton != null){
                    AvatarButton.remove();
                }
                break;
            case currentURL.includes("/home/avatar/"):
                addAvatarButton();
                if(UserButton != null){
                    UserButton.remove();
                }
                break;
            default:
                if(UserButton != null){
                    UserButton.remove();
                }
                if(AvatarButton != null){
                    AvatarButton.remove();
                }
                break;
        }
    }


    function addUserButton(){
        let navbarSection = document.querySelector('.navbar-section.left-nav');

        if (navbarSection && !document.querySelector('#OpenUserinVRCX')) {
            UserButton = document.createElement('button');
            UserButton.id = 'OpenUserinVRCX';
            UserButton.innerText = 'Open User in VRCX';

            UserButton.classList.add('p-2', 'btn', 'navbar-btn', 'medium');

            let vrcsettingsSVG = document.querySelector('.svg-inline--fa.fa-gears.fa-lg.css-1efeorg.e9fqopp0');
            if (vrcsettingsSVG) {
                let svgClone = vrcsettingsSVG.cloneNode(true);
                svgClone.style.marginRight = '8px';
                UserButton.insertBefore(svgClone, UserButton.firstChild);
            }

            UserButton.onclick = function() {
                var trimid = window.location.href.lastIndexOf('/');
                var parsedid = window.location.href.substring(trimid + 1);
                let uriPath = new URL("vrcx://user/" + parsedid);
                window.open(uriPath, '_self');
            };

            navbarSection.appendChild(UserButton);
        }
    }

    function addAvatarButton(){
        let navbarSection = document.querySelector('.navbar-section.left-nav');

        if (navbarSection && !document.querySelector('#OpenAvatarinVRCX')) {
            AvatarButton = document.createElement('button');
            AvatarButton.id = 'OpenAvatarinVRCX';
            AvatarButton.innerText = 'Open Avatar in VRCX';

            AvatarButton.classList.add('p-2', 'btn', 'navbar-btn', 'medium');

            let vrcsettingsSVG = document.querySelector('.svg-inline--fa.fa-gears.fa-lg.css-1efeorg.e9fqopp0');
            if (vrcsettingsSVG) {
                let svgClone = vrcsettingsSVG.cloneNode(true);
                svgClone.style.marginRight = '8px';
                AvatarButton.insertBefore(svgClone, AvatarButton.firstChild);
            }

            AvatarButton.onclick = function() {
                var trimid = window.location.href.lastIndexOf('/');
                var parsedid = window.location.href.substring(trimid + 1);
                let uriPath = new URL("vrcx://avatar/" + parsedid);
                window.open(uriPath, '_self');
            };

            navbarSection.appendChild(AvatarButton);
        }
    }

    function awa() {
        console.log("awa");
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            addButtonToNavbar();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', addButtonToNavbar);
    window.addEventListener('popstate', awa);
})();
