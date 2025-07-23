// Briecheeze - content.js v3.0
// The syringe that injects the ultimate weapon.

console.log("[Briecheeze] Injector script is running.");

const script = document.createElement('script');
script.src = chrome.runtime.getURL('injector.js');
(document.head || document.documentElement).appendChild(script);

script.onload = () => {
  console.log("[Briecheeze] The ultimate weapon (injector.js) has been successfully injected!");
  // The injected script will live on its own, so we can remove the element.
  script.remove();
};