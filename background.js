chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "startCapture") {
      chrome.permissions.request(
        {
          permissions: ["camera", "microphone"],
        },
        (granted) => {
          if (granted) {
            chrome.tabCapture.capture(
              {
                audio: false,
                video: true,
                videoConstraints: {
                  mandatory: {
                    minWidth: 640,
                    minHeight: 480,
                    maxWidth: 640,
                    maxHeight: 480,
                  },
                },
              },
              (stream) => {
                sendResponse({ stream: stream });
              }
            );
          } else {
            sendResponse({ error: "Permission denied" });
          }
        }
      );
      return true;
    }
  });
  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isRunning: false });
  });
  