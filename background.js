/* DefaultSettings */
var defaultSettings = {
  proxyType: "manual",
  manProxyAddress: "localhost",
  manProxyPort: "8080",
  proxyOn: "true"
};
/* Checks for stored settings and sets the proxy after the first run*/
function checkStoredSettings(storedSettings) {
  if (!storedSettings.proxyType) {
    browser.storage.local.set(defaultSettings);
    storedSettings = defaultSettings;
  }
}
/* Updates the stored settings */
function updateSettings(settings) {
  browser.storage.local.set(settings);
}
/* Retrievs the stored settings */
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
/* General error function */
function onError(e) {
  console.error(e);
}
/* Sets the proxy configuration */
function setProxy(valType, valStored){
  let proxyTypes = {
    proxyType : valType,
    http: `${valStored.manProxyAddress}:${valStored.manProxyPort}`,
    ssl: `${valStored.manProxyAddress}:${valStored.manProxyPort}`,
    socksVersion: 5,
    passthrough: ".mozilla.org, .firefox.com, .mozilla.com, .wappalyzer.com"
  };
  browser.proxy.settings.set({value: proxyTypes});
  setIcon((valType != "none"));
}
/* Sets the webextension icon */
function setIcon(val){
  let icon = val == true ? "1" : "2";
  browser.browserAction.setIcon({path: `icons/icons8-${icon}-26.png`});
}
/* Switches the proxy between none and system usage */
function switchProxy(storedSettings) {
  let proxyType = "";
  if (storedSettings.proxyOn == "false"){
    storedSettings.proxyOn = "true";
    proxyType = "none";
  } else {
    storedSettings.proxyOn = "false";
    proxyType = "manual";
  }

  updateSettings(storedSettings);
  setProxy(proxyType, storedSettings);
}


browser.browserAction.onClicked.addListener(() => {
  const gettingStoredSettings = browser.storage.local.get();
  gettingStoredSettings.then(switchProxy, onError);
});
