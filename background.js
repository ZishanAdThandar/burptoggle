// Hacker Proxy Pro – background.js
// Works in both Firefox (browser.*) and Chrome (chrome.*)

const isFirefox = typeof browser !== "undefined";
const api = isFirefox ? browser : chrome;

// Modes: Direct (none), Burp, Tor
const MODES = [
  { id: "none", label: "Direct (no proxy)" },
  { id: "burp", label: "Burp Suite – 127.0.0.1:8080" },
  { id: "tor",  label: "Tor – 127.0.0.1:9050" }
];

let currentIndex = 0;

// ================= ICON CACHE + ICON DATA =================

const iconCache = new Map();

// Your full icon set (data URIs) + cache
function getIconData(mode) {
  // Normalize: our "none" mode may also be stored as "off" in older code
  const key = mode === "off" ? "none" : mode;

  if (iconCache.has(key)) {
    return iconCache.get(key);
  }

  const icons = {
    none: {
      "16": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjNjY2NjY2IiByeD0iMiIvPgo8dGV4dCB4PSI4IiB5PSIxMiIgZm9udC1mYW1pbHk9Ik1vbmFzcGFjZSxDb3VyaWVyIE5ldyIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkZGRkYiPkg8L3RleHQ+Cjwvc3ZnPgo=",
      "32": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNjY2NjY2IiByeD0iMyIvPgo8dGV4dCB4PSIxNiIgeT0iMjIiIGZvbnQtZmFtaWx5PSJNb25hc3BhY2UsQ291cmllciBOZXciIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIj5IPC90ZXh0Pgo8L3N2Zz4K",
      "48": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjNjY2NjY2IiByeD0iNCIvPgo8dGV4dCB4PSIyNCIgeT0iMzIiIGZvbnQtZmFtaWx5PSJNb25hc3BhY2UsQ291cmllciBOZXciIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIj5IPC90ZXh0Pgo8L3N2Zz4K"
    },
    burp: {
      "16": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDBGRjQxIiByeD0iMiIvPgo8dGV4dCB4PSI4IiB5PSIxMiIgZm9udC1mYW1pbHk9Ik1vbmFzcGFjZSxDb3VyaWVyIE5ldyIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDAiPkg8L3RleHQ+Cjwvc3ZnPgo=",
      "32": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMDBGRjQxIiByeD0iMyIvPgo8dGV4dCB4PSIxNiIgeT0iMjIiIGZvbnQtZmFtaWx5PSJNb25hc3BhY2UsQ291cmllciBOZXciIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDAwIj5IPC90ZXh0Pgo8L3N2Zz4K",
      "48": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMDBGRjQxIiByeD0iNCIvPgo8dGV4dCB4PSIyNCIgeT0iMzIiIGZvbnQtZmFtaWx5PSJNb25hc3BhY2UsQ291cmllciBOZXciIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDAwIj5IPC90ZXh0Pgo8L3N2Zz4K"
    },
    tor: {
      "16": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjODA0MEEwIiByeD0iMiIvPgo8dGV4dCB4PSI4IiB5PSIxMiIgZm9udC1mYW1pbHk9Ik1vbmFzcGFjZSxDb3VyaWVyIE5ldyIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkZGRkYiPkg8L3RleHQ+Cjwvc3ZnPgo=",
      "32": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjODA0MEEwIiByeD0iMyIvPgo8dGV4dCB4PSIxNiIgeT0iMjIiIGZvbnQtZmFtaWx5PSJNb25hc3BhY2UsQ291cmllciBOZXciIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIj5IPC90ZXh0Pgo8L3N2Zz4K",
      "48": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjODA0MEEwIiByeD0iNCIvPgo8dGV4dCB4PSIyNCIgeT0iMzIiIGZvbnQtZmFtaWx5PSJNb25hc3BhY2UsQ291cmllciBOZXciIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIj5IPC90ZXh0Pgo8L3N2Zz4K"
    }
  };

  const iconData = icons[key] || icons.none;
  iconCache.set(key, iconData);
  return iconData;
}

// ================= STORAGE HELPERS =================

function getStoredModeId(defaultId = "none") {
  return new Promise(resolve => {
    try {
      api.storage.local.get({ modeId: defaultId }, result => {
        resolve(result && result.modeId ? result.modeId : defaultId);
      });
    } catch (e) {
      if (isFirefox && api.storage && api.storage.local) {
        api.storage.local.get({ modeId: defaultId })
          .then(result => resolve(result.modeId || defaultId))
          .catch(() => resolve(defaultId));
      } else {
        resolve(defaultId);
      }
    }
  });
}

function setStoredModeId(modeId) {
  try {
    api.storage.local.set({ modeId });
  } catch (e) {
    if (isFirefox && api.storage && api.storage.local) {
      api.storage.local.set({ modeId }).catch(() => {});
    }
  }
}

// ================= PROXY HANDLERS =================

function firefoxProxyHandler(details) {
  const mode = MODES[currentIndex];

  if (mode.id === "burp") {
    return {
      type: "http",
      host: "127.0.0.1",
      port: 8080
    };
  }

  if (mode.id === "tor") {
    return {
      type: "socks",
      host: "127.0.0.1",
      port: 9050
    };
  }

  // Direct connection
  return {
    type: "direct"
  };
}

function applyFirefoxProxy() {
  if (!api.proxy || !api.proxy.onRequest) return;

  if (api.proxy.onRequest.hasListener(firefoxProxyHandler)) {
    api.proxy.onRequest.removeListener(firefoxProxyHandler);
  }

  const mode = MODES[currentIndex];

  if (mode.id === "none") {
    // no listener => direct
    return;
  }

  api.proxy.onRequest.addListener(
    firefoxProxyHandler,
    { urls: ["<all_urls>"] }
  );
}

function applyChromeProxy() {
  if (!api.proxy || !api.proxy.settings) return;

  const mode = MODES[currentIndex];

  if (mode.id === "none") {
    api.proxy.settings.set(
      {
        value: { mode: "direct" },
        scope: "regular"
      },
      () => void 0
    );
    return;
  }

  const isBurp = mode.id === "burp";
  const host = "127.0.0.1";
  const port = isBurp ? 8080 : 9050;
  const scheme = isBurp ? "http" : "socks5";

  api.proxy.settings.set(
    {
      value: {
        mode: "fixed_servers",
        rules: {
          singleProxy: { scheme, host, port },
          bypassList: ["<local>"]
        }
      },
      scope: "regular"
    },
    () => void 0
  );
}

// ================= UI (ICON + BADGE) =================

function updateBrowserAction() {
  const mode = MODES[currentIndex];
  const modeId = mode.id;
  const title = "Hacker Proxy Pro – " + mode.label;

  if (!api.browserAction) return;

  if (api.browserAction.setTitle) {
    api.browserAction.setTitle({ title });
  }

  // ---- ICON ----
  if (api.browserAction.setIcon) {
    const iconData = getIconData(modeId);
    api.browserAction.setIcon({ path: iconData });
  }

  // ---- BADGE ----
  if (api.browserAction.setBadgeText && api.browserAction.setBadgeBackgroundColor) {
    if (modeId === "burp") {
      // Same theme as Burp icon (#00FF41 with dark text)
      api.browserAction.setBadgeText({ text: "Burp" });
      api.browserAction.setBadgeBackgroundColor({ color: [0, 255, 65, 255] }); // #00FF41
    } else if (modeId === "tor") {
      // Same theme as Tor icon (#8040A0)
      api.browserAction.setBadgeText({ text: "Tor" });
      api.browserAction.setBadgeBackgroundColor({ color: [128, 64, 160, 255] }); // #8040A0
    } else {
      // No proxy: no badge (or you can show "Off" with grey bg)
      api.browserAction.setBadgeText({ text: "" });
      // Optional: uncomment to give a grey "Off" badge:
      // api.browserAction.setBadgeText({ text: "Off" });
      // api.browserAction.setBadgeBackgroundColor({ color: [102, 102, 102, 255] }); // #666666
    }
  }
}

function applyMode() {
  if (isFirefox) {
    applyFirefoxProxy();
  } else {
    applyChromeProxy();
  }
  updateBrowserAction();
}

// ================= INIT =================

async function init() {
  const storedModeId = await getStoredModeId("burp");
  const idx = MODES.findIndex(m => m.id === storedModeId);
  currentIndex = idx >= 0 ? idx : 0;

  applyMode();
}

if (api.browserAction && api.browserAction.onClicked) {
  api.browserAction.onClicked.addListener(() => {
    currentIndex = (currentIndex + 1) % MODES.length;
    setStoredModeId(MODES[currentIndex].id);
    applyMode();
  });
}

init();

