# Starter WebView Plugin

This starter plugin is to demonstrate usage of WebView in your UXP plugin. In this plugin, WebView is loaded in a dialog and makes use of HTML Canvas element to demo WebGL features. It also demoes the communication between plugin panel and remote webviewcontent via postMessage communication (https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

UXP version 6 and higher has support for Webview. Currently, UXP Webview can be used only in a dialog and cannot be used in other containers like panel. Webview can be used as an escape hatch that can help use web features that are not supported in UXP natively.

In order to use WebViews in a plugin, webView permissons must be added in manifest.json (Refer existing manifest):
- webview.allow - Enables webview access to the plugin
- webview.domains - If webview is specified, this indicates the domains the webview can render.No specific permissions required here, but "allow" needs it.
- webview.enableMessageBridge - Enables WebView & the content loaded on WebView to communicate via postMessage<br>
**UXP Plugin → WebView Content** : 
```HTMLWebViewElement.postMessage(message, targetOrigin, transfer)``` <br>
**WebView Content → UXP Plugin** :
```window.uxpHost.postMessage(message, targetOrigin, transfer)```


## WebView Demo Server
UXP WebView only supports loading a web URL and does not currently support loading local html content. To demo, a sample web page is hosted in a local server and we load this web url in our plugin.
Any web content URL can be loaded in UXP WebView similar to this example.<br>

For this plugin demo, use the below steps to serve the remote content & view the Canvas loaded in Webview:
- Install http server using `sudo npm install -g http-server`.
- Traverse to `{yourplugindirectory}/Receiver` folder and run `http-server -p 7724`
- Then follow the below steps for loading the plugin in PS<br>

## Loading in Host App

You can load this plugin directly in Photoshop by using the UXP Developer Tools application. Once started, click "Add Plugin...", and navigate to the "manifest.json" file in this folder. Then click the ••• button next to the corresponding entry in the developer tools and click "Load". Switch over to the host app, and the plugin's panel will be running.

## Version Requirements

UXP Version : 6.0 or higher
PS Version : 23.3.0 or higher
XD Version : 54.0 or higher