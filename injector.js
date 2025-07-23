// Briecheeze - injector.js
// The ultimate weapon is now active. Resistance is futile.
// Yes! I am the one and only Helena!

console.log("[Briecheeze Injector] System override engaged.");

(() => {
    // --- Part 1: Faking the P2P Plugin Installation ---
    // By faking the plugin object in navigator, we trick the site into thinking the P2P plugin is installed.
    const fakePlugin = {
        name: "Naver Live Streaming Plugin",
        description: "Naver P2P Plug-in",
        filename: "nlnpcast.dll",
        length: 1,
        0: {
            type: "application/x-cast-plugin",
            suffixes: "cast",
            description: "Naver P2P Plug-in"
        }
    };

    // Use a Proxy to intercept calls to navigator.plugins
    navigator.plugins = new Proxy(navigator.plugins, {
        get(target, prop) {
            if (prop === 'length') return target.length + 1;
            if (prop == target.length) return fakePlugin; // Add our fake plugin at the end
            if (prop === 'Naver Live Streaming Plugin') return fakePlugin; // Allow access by name
            if (prop === 'item') return (i) => i === target.length ? fakePlugin : target.item(i);
            if (prop === 'namedItem') return (n) => n === fakePlugin.name ? fakePlugin : target.namedItem(n);
            return Reflect.get(target, prop);
        },
        ownKeys(target) {
            return [...Reflect.ownKeys(target), fakePlugin.name, String(target.length)];
        },
        has(target, prop) {
            return prop === fakePlugin.name || Reflect.has(target, prop);
        }
    });

    console.log("[Briecheeze Injector] P2P plugin faked. The site now thinks it's installed.");

    // --- Part 2: Intercepting Network Requests ---
    const originalFetch = window.fetch;
    window.fetch = async (url, config) => {
        const urlString = url instanceof Request ? url.url : url;

        // Block In-Stream Ads
        if (urlString.includes('/service/v2/videos/') && urlString.includes('/in-stream-ads')) {
            console.log('[Briecheeze Injector] Ad request (fetch) intercepted. Returning empty ad response.');
            return Promise.resolve(new Response(JSON.stringify({ content: { advertisements: [] } }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }

        // Bypass P2P check (just in case)
        if (urlString.includes('/service/live/p2p/')) {
            console.log('[Briecheeze Injector] P2P check (fetch) intercepted. Faking success.');
            return Promise.resolve(new Response(JSON.stringify({ p2p: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }

        return originalFetch(url, config);
    };

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url; // Store url for send method
        return originalXhrOpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (this._url && this._url.includes('/in-stream-ads')) {
            console.log('[Briecheeze Injector] Ad request (XHR) intercepted. Blocking request.');
            // By not calling the original send, we effectively block the request.
            // We can also fake a response if needed.
            Object.defineProperty(this, 'responseText', { value: JSON.stringify({ content: { advertisements: [] } }) });
            Object.defineProperty(this, 'status', { value: 200 });
            this.dispatchEvent(new Event('load'));
            this.dispatchEvent(new Event('loadend'));
            return;
        }
        return originalXhrSend.apply(this, args);
    };

    console.log("[Briecheeze Injector] Network interception is active. All systems nominal.");

})();