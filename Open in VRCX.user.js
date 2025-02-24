// ==UserScript==
// @name         Open in VRCX
// @namespace    http://tampermonkey.net/
// @version      1.4.4
// @updateURL    https://raw.githubusercontent.com/Myrkie/open-in-vrcx/mistress/Open%20in%20VRCX.user.js?
// @downloadURL  https://raw.githubusercontent.com/Myrkie/open-in-vrcx/mistress/Open%20in%20VRCX.user.js?
// @description  Adds an "Open in VRCX" button to the tabs in the VRChat website;
// @icon         https://www.google.com/s2/favicons?domain=vrchat.com
// @author       Myrkur
// @match        https://vrchat.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @match        https://vrchat.net/*
// ==/UserScript==

(function() {
    'use strict';

    let UserButton, AvatarButton, WorldButton, GroupButton, SwapButton, LaunchButton;
    let debounceTimer;

    // noinspection JSUnusedGlobalSymbols
    GM_config.init({
        id: 'OpenInVRCXSettings',
        title: 'Open In VRCX Settings',
        fields: {
            reloadTime: {
                label: '<span title="Set how often the page reloads in milliseconds. Lower values may cause excessive reloads and page slowdowns">Reload Interval (Milliseconds) ⓘ</span>',
                type: 'int',
                default: 100
            }
        },
        css: `
        #html {
            color: white;
        }
        #OpenInVRCXSettings {
            background: #0e0e0e;
            padding: 20px;
            border: 1px solid magenta;
            border-radius: 8px;
            box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
            position: fixed;
            color: white;
            font-family: Arial, sans-serif;
            width: 350px;
        }
        #OpenInVRCXSettings .config_header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
            color: white;
        }
        #OpenInVRCXSettings .section_header {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
            color: white;
        }
        #OpenInVRCXSettings input[type="text"],
        #OpenInVRCXSettings input[type="number"] {
            background: #222;
            color: white;
            border: 1px solid magenta;
            padding: 5px;
            border-radius: 4px;
            width: 100%;
        }
        #OpenInVRCXSettings .saveclose_buttons {
            text-align: center;
            margin-top: 10px;
            border: 1px solid magenta;
            background: #222;
            color: white;
        }
        #OpenInVRCXSettings_resetLink {
            color: white;
        }
        #OpenInVRCXSettings .field_label{
            color: magenta;
            font-size: 14px;
        }
        #OpenInVRCXSettings .reset_holder a {
            color: white;
            display: inline-block;
            margin-top: 10px;
        }

    `,
        events: {
            init: function () {
                let reloadTime = this.get('reloadTime');
                console.log("Initialized Reload Time:", reloadTime);

                const observer = new MutationObserver(debounce(() => {
                    addButtonToNavbar();
                }, reloadTime));

                observer.observe(document.querySelector('.navbar-section.left-nav') || document.body, { childList: true, subtree: true });
            },
            save: function () {
                let reloadTime = this.get('reloadTime');
                console.log("Saved Reload Time:", reloadTime);
                location.reload();
            }
        }
    });

    GM_registerMenuCommand('Open in VRCX Settings', function() {
        GM_config.open();
    });


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
            case currentURL.includes("/home/launch"):
                if(!document.querySelector('#OpenLaunchVRCX')) {
                    addLaunchButton();
                }
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
    function addLaunchButton() {
        let launchSelector = document.querySelector('.css-1qycygp.flex-shrink-1.text-left');

        if (launchSelector) {
            LaunchButton = document.createElement('button');
            LaunchButton.id = 'OpenLaunchVRCX';
            LaunchButton.innerText = 'Open in VRCX';

            LaunchButton.classList.add('btn-primary', 'launch-btn', 'secondary-launch-btn', 'w-100', 'btn', 'btn-secondary');
            addSVGIcon(LaunchButton);

            LaunchButton.onclick = function() {
                const uriPath = new URL(`vrcx://world/${window.location.href}`);
                window.open(uriPath, '_self');
            };

            launchSelector.appendChild(LaunchButton);
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
    window.addEventListener('load', addButtonToNavbar);
})();
