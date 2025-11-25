// Hacker Proxy Pro – Restart-Safe Background Script (MV2)

const isFirefox = typeof browser !== "undefined";
const api = isFirefox ? browser : chrome;

// Modes definition
const MODES = [
  { id: "none", label: "Direct (no proxy)" },
  { id: "burp", label: "Burp Suite – 127.0.0.1:8080" },
  { id: "tor",  label: "Tor – 127.0.0.1:9050" }
];

// ---------------------------- ICON CACHE ----------------------------

const iconCache = new Map();

function getIconData(mode) {
  const key = mode === "off" ? "none" : mode;

  if (iconCache.has(key)) return iconCache.get(key);

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

  const data = icons[key] || icons.none;
  iconCache.set(key, data);
  return data;
}

// ---------------------------- STORAGE HELPERS ----------------------------

function getStoredModeId(defaultId = "none") {
  return new Promise(resolve => {
    api.storage.local.get({ modeId: defaultId }, result =>
      resolve(result.modeId || defaultId)
    );
  });
}

function setStoredModeId(id) {
  api.storage.local.set({ modeId: id });
}

function getModeById(id) {
  return MODES.find(m => m.id === id) || MODES[0];
}

function getNextModeId(id) {
  const i = MODES.findIndex(m => m.id === id);
  return MODES[(i + 1) % MODES.length].id;
}

// ---------------------------- FIREFOX PROXY ----------------------------

async function firefoxProxyHandler(details) {
  const id = await getStoredModeId("none");
  const mode = getModeById(id);

  if (mode.id === "burp")
    return { type: "http", host: "127.0.0.1", port: 8080 };

  if (mode.id === "tor")
    return { type: "socks", host: "127.0.0.1", port: 9050, proxyDNS: true };

  return { type: "direct" };
}

async function applyFirefoxProxy() {
  if (!api.proxy || !api.proxy.onRequest) return;

  if (api.proxy.onRequest.hasListener(firefoxProxyHandler))
    api.proxy.onRequest.removeListener(firefoxProxyHandler);

  const id = await getStoredModeId("none");
  if (id === "none") return;

  api.proxy.onRequest.addListener(
    firefoxProxyHandler,
    { urls: ["<all_urls>"] }
  );
}

// ---------------------------- CHROME PROXY ----------------------------

async function applyChromeProxy() {
  const id = await getStoredModeId("none");
  const mode = getModeById(id);

  if (mode.id === "none") {
    api.proxy.settings.set({
      value: { mode: "direct" },
      scope: "regular"
    });
    return;
  }

  const isBurp = mode.id === "burp";
  api.proxy.settings.set({
    value: {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: isBurp ? "http" : "socks5",
          host: "127.0.0.1",
          port: isBurp ? 8080 : 9050
        },
        bypassList: ["<local>"]
      }
    },
    scope: "regular"
  });
}

// ---------------------------- UI ICON + BADGE ----------------------------

async function updateBrowserAction() {
  const id = await getStoredModeId("none");
  const mode = getModeById(id);

  const action = api.browserAction;

  action.setTitle({ title: "Hacker Proxy Pro – " + mode.label });
  action.setIcon({ path: getIconData(mode.id) });

  if (mode.id === "burp") {
    action.setBadgeText({ text: "Burp" });
    action.setBadgeBackgroundColor({ color: [0, 255, 65, 255] });
  } else if (mode.id === "tor") {
    action.setBadgeText({ text: "Tor" });
    action.setBadgeBackgroundColor({ color: [128, 64, 160, 255] });
  } else {
    action.setBadgeText({ text: "" });
  }
}

// ---------------------------- APPLY MODE ----------------------------

async function applyMode() {
  if (isFirefox) await applyFirefoxProxy();
  else await applyChromeProxy();

  await updateBrowserAction();
}

// ---------------------------- INIT ----------------------------

async function init() {
  const id = await getStoredModeId("none");
  await setStoredModeId(id); // ensure consistency
  await applyMode();
}

// On click: switch mode and apply
if (api.browserAction && api.browserAction.onClicked) {
  api.browserAction.onClicked.addListener(async () => {
    const current = await getStoredModeId("none");
    const next = getNextModeId(current);
    setStoredModeId(next);
    applyMode();
  });
}

// Ensure restore after sleep/startup
if (api.runtime.onStartup)
  api.runtime.onStartup.addListener(init);

if (api.runtime.onInstalled)
  api.runtime.onInstalled.addListener(init);

// First run
init();

