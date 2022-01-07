function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    manProxyAddress: document.querySelector("#proxyAddress").value,
    manProxyPort: document.querySelector("#proxyPort").value,
    proxyType: document.querySelector('#swBurp').checked == true ? "manual" : "system"
  });
}

function restoreOptions() {

  function setCurrent(result) {
    document.querySelector("#proxyAddress").value = result.manProxyAddress || "127.0.0.1";
    document.querySelector("#proxyPort").value = result.manProxyPort || "8080";
    document.querySelector('#swManual').checked = result.proxyType == "system";
    document.querySelector('#swBurp').checked = result.proxyType == "manual";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get();
  getting.then(setCurrent, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
