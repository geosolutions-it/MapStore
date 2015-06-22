/*
 Copyright 2014 Google Inc. All rights reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function(window) {

  if (!!window.cookieChoices) {
    return window.cookieChoices;
  }

  var document = window.document;
  // IE8 does not support textContent, so we should fallback to innerText.
  var supportsTextContent = 'textContent' in document.body;

  var cookieChoices = (function() {

    var cookieName = 'displayCookieConsent';
    var cookieConsentId = 'cookieChoiceInfo';
    var dismissLinkId = 'cookieChoiceDismiss';

    function _createHeaderElement(cookieText, dismissText, linkText, linkHref) {
	  /*start modification*/
      var butterBarStyles = 'position:fixed;width:100%;background-color:#5a5a5a;height:20px;' +
          'margin:0; left:0; top:0;padding:10px;z-index:1000;text-align:center;';
      /*end modification*/
	  
      var cookieConsentElement = document.createElement('div');
      cookieConsentElement.id = cookieConsentId;
      cookieConsentElement.style.cssText = butterBarStyles;
      cookieConsentElement.appendChild(_createConsentText(cookieText));

      if (!!linkText && !!linkHref) {
        cookieConsentElement.appendChild(_createInformationLink(linkText, linkHref));
      }
      cookieConsentElement.appendChild(_createDismissLink(dismissText));
      return cookieConsentElement;
    }

    function _createDialogElement(cookieText, dismissText, linkText, linkHref) {
      var glassStyle = 'position:fixed;width:100%;height:100%;z-index:999;' +
          'top:0;left:0;opacity:0.5;filter:alpha(opacity=50);' +
          'background-color:#ccc;';
      var dialogStyle = 'z-index:1000;position:fixed;left:50%;top:50%';
      var contentStyle = 'position:relative;left:-50%;margin-top:-25%;' +
          'background-color:#fff;padding:20px;box-shadow:4px 4px 25px #888;';

      var cookieConsentElement = document.createElement('div');
      cookieConsentElement.id = cookieConsentId;

      var glassPanel = document.createElement('div');
      glassPanel.style.cssText = glassStyle;

      var content = document.createElement('div');
      content.style.cssText = contentStyle;

      var dialog = document.createElement('div');
      dialog.style.cssText = dialogStyle;

      var dismissLink = _createDismissLink(dismissText);
      dismissLink.style.display = 'block';
      dismissLink.style.textAlign = 'right';
      dismissLink.style.marginTop = '8px';

      content.appendChild(_createConsentText(cookieText));
      if (!!linkText && !!linkHref) {
        content.appendChild(_createInformationLink(linkText, linkHref));
      }
      content.appendChild(dismissLink);
      dialog.appendChild(content);
      cookieConsentElement.appendChild(glassPanel);
      cookieConsentElement.appendChild(dialog);
      return cookieConsentElement;
    }

    function _setElementText(element, text) {
      if (supportsTextContent) {
        element.textContent = text;
      } else {
        element.innerText = text;
      }
    }

    function _createConsentText(cookieText) {
      var consentText = document.createElement('span');
      _setElementText(consentText, cookieText);
	  
	  /*start modification*/
	  consentText.style.color = '#fff';
	  consentText.style.fontSize = '12px';
	  /*end modification*/
	  
      return consentText;
    }

    function _createDismissLink(dismissText) {
      var dismissLink = document.createElement('a');
      _setElementText(dismissLink, dismissText);
      dismissLink.id = dismissLinkId;
      dismissLink.href = '#';
      dismissLink.style.marginLeft = '24px';
	  
	  /*start modification*/
	  dismissLink.style.backgroundColor = '#303030';
	  dismissLink.style.border = "1px solid rgba(0,0,0,.1)";
	  dismissLink.style.mozBorderRadius = "2px";
	  dismissLink.style.webkitBorderRadius = "2px";
	  dismissLink.style.borderRadius = "2px";
	  dismissLink.style.color = "#fff";
	  dismissLink.style.cursor = "pointer";
	  dismissLink.style.lineHeight = "19px";
	  dismissLink.style.padding = "4px 8px";
	  dismissLink.style.textDecoration = "none";
	  dismissLink.style.whiteSpace = "nowrap";
	  dismissLink.style.fontSize = '13px';
	  dismissLink.style.fontWeight = 'bold';
	  /*end modification*/ 
	  
      return dismissLink;
    }

    function _createInformationLink(linkText, linkHref) {
      var infoLink = document.createElement('a');
      _setElementText(infoLink, linkText);
      infoLink.href = linkHref;
      infoLink.target = '_blank';
      infoLink.style.marginLeft = '8px';
	  
	  /*start modification*/
	  infoLink.style.backgroundColor = '#303030';
	  infoLink.style.border = "1px solid rgba(0,0,0,.1)";
	  infoLink.style.mozBorderRadius = "2px";
	  infoLink.style.webkitBorderRadius = "2px";
	  infoLink.style.borderRadius = "2px";
	  infoLink.style.color = "#fff";
	  infoLink.style.cursor = "pointer";
	  infoLink.style.lineHeight = "19px";
	  infoLink.style.padding = "4px 8px";
	  infoLink.style.textDecoration = "none";
	  infoLink.style.whiteSpace = "nowrap";
	  infoLink.style.fontSize = '13px';
	  infoLink.style.fontWeight = 'bold';
	  /*end modification*/ 
      
	  return infoLink;
    }

    function _dismissLinkClick() {
      _saveUserPreference();
      _removeCookieConsent();
      return false;
    }

    function _showCookieConsent(cookieText, dismissText, linkText, linkHref, isDialog) {
      if (_shouldDisplayConsent()) {
        _removeCookieConsent();
        var consentElement = (isDialog) ?
            _createDialogElement(cookieText, dismissText, linkText, linkHref) :
            _createHeaderElement(cookieText, dismissText, linkText, linkHref);
        var fragment = document.createDocumentFragment();
        fragment.appendChild(consentElement);
        document.body.appendChild(fragment.cloneNode(true));
        document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
      }
    }

    function showCookieConsentBar(cookieText, dismissText, linkText, linkHref) {
      _showCookieConsent(cookieText, dismissText, linkText, linkHref, false);
    }

    function showCookieConsentDialog(cookieText, dismissText, linkText, linkHref) {
      _showCookieConsent(cookieText, dismissText, linkText, linkHref, true);
    }

    function _removeCookieConsent() {
      var cookieChoiceElement = document.getElementById(cookieConsentId);
      if (cookieChoiceElement != null) {
        cookieChoiceElement.parentNode.removeChild(cookieChoiceElement);
      }
    }

    function _saveUserPreference() {
      // Set the cookie expiry to one year after today.
      var expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = cookieName + '=y; expires=' + expiryDate.toGMTString();
    }

    function _shouldDisplayConsent() {
      // Display the header only if the cookie has not been set.
      return !document.cookie.match(new RegExp(cookieName + '=([^;]+)'));
    }

    var exports = {};
    exports.showCookieConsentBar = showCookieConsentBar;
    exports.showCookieConsentDialog = showCookieConsentDialog;
    return exports;
  })();

  window.cookieChoices = cookieChoices;
  return cookieChoices;
})(this);

document.addEventListener(
	"DOMContentLoaded",
	function(event) {
		cookieChoices.showCookieConsentBar(
		"Questo sito web utilizza i cookies per erogare servizi di qualità, continuando la navigazione l'utente acconsente al loro utilizzo.",
		"Accetto", 
		"Ulteriori Informazioni", 
		"cookies-policy.html");
	}
);