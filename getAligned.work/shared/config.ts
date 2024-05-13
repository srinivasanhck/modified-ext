const MODE: any = process.env.NODE_ENV;

const URLS: any = {
  client: {
    development: "http://localhost:5173#",
    production: "http://localhost:5173#",
    // development: "https://app.getaligned.work#",
    // production: chrome.runtime.getURL("pages/popup/index.html#"),
    // production: "https://app.getaligned.work#",
  },
};

const APP_URL = URLS.client[MODE];

// export const TESTING_URL="https://stage.ekalign.com";
export const TESTING_URL="https://api.getaligned.work";

const REDIRECT_URL_AFTER_EXTENSION_DOWNLOAD = "<url>";

export { APP_URL, MODE, URLS, REDIRECT_URL_AFTER_EXTENSION_DOWNLOAD };





// {
//   "manifest_version": 3,
//   "name": "GetAligned.work",
//   "description": "Get Aligned: Create, Track Tasks, and Stay Organized",
//   "version": "0.1",
//   "icons": {
//     "16": "/assets/icons/icon16.png",
//     "32": "/assets/icons/icon32.png",
//     "48": "/assets/icons/icon48.png",
//     "128": "/assets/icons/icon128.png"
//   },
//   "action": {
//     "default_icon": {
//       "16": "/assets/icons/icon16.png",
//       "32": "/assets/icons/icon32.png",
//       "48": "/assets/icons/icon48.png",
//       "128": "/assets/icons/icon128.png"
//     }
//   },
//   "background": {
//     "service_worker": "/ExtensionBackground.js"
//   },
//   "content_scripts": [
//     {
//       "run_at": "document_start",
//       "all_frames": false,
//       "matches": ["https://mail.google.com/*","https://extension.getaligned.work/*","http://localhost5173/*"],
//       "js": ["/ExtensionContent.js"]
//     }
//   ],
//   "permissions": [
//     "storage",
//     "tabs",
//     "unlimitedStorage",
//     "identity",
//     "activeTab"
//   ],
//   "host_permissions": [
//     "https://stage.ekalign.com/*",
//     "http://localhost5173/*",
//     "https://extension.getaligned.work/*",
//     "https://www.googleapis.com/auth/gmail.labels",
//     "https://www.googleapis.com/auth/gmail.modify",
//     "https://www.googleapis.com/auth/userinfo.email"
//   ],
//   "web_accessible_resources": [
//     {
//       "resources": ["*"],
//       "matches": ["https://*/*", "http://*/*"],
//       "extension_ids": []
//     }
//   ]
// }
