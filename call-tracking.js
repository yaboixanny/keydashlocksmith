(function () {
  "use strict";

  var businessNumber = "3657669566";
  var pendingForwardingNumber = null;

  function digitsOnly(value) {
    return String(value || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  }

  function replaceNumberText(link, formattedNumber) {
    var walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    var textNode;

    while ((textNode = walker.nextNode())) {
      if (digitsOnly(textNode.nodeValue).includes(businessNumber)) {
        textNode.nodeValue = textNode.nodeValue.replace(
          /(?:\+?1[\s.-]?)?\(?365\)?[\s.-]*766[\s.-]*9566/g,
          formattedNumber
        );
      }
    }
  }

  function applyForwardingNumber(formattedNumber, mobileNumber) {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      if (digitsOnly(link.getAttribute("href")) !== businessNumber) {
        return;
      }

      link.setAttribute("href", "tel:" + mobileNumber);
      replaceNumberText(link, formattedNumber);
    });
  }

  window.keydashPhoneConversionCallback = function (formattedNumber, mobileNumber) {
    pendingForwardingNumber = {
      formatted: formattedNumber,
      mobile: mobileNumber
    };

    if (document.readyState !== "loading") {
      applyForwardingNumber(formattedNumber, mobileNumber);
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (pendingForwardingNumber) {
      applyForwardingNumber(
        pendingForwardingNumber.formatted,
        pendingForwardingNumber.mobile
      );
    }
  });
})();
