# vBulletin-Syntax-Highlighter
[Available on the Chrome App Store here](https://chrome.google.com/webstore/detail/syntax-highlighter-for-ex/lfepfbglmpkdfbjmbonacjapndgmjdoe)
---
Very simple Chrome Extension that syntax highlights VBA code on vBulletin Sites

It adds bbcode tags to code snippets in VB6/VBA, attempts to recognise:
 - Strings & Comments
 - Functions
 - Keywords
 
Colours for the above are customizable through the options page of the extension.

Tags are added by highlighteing the code and hitting `Alt+a`.

Currently this only works for the "Enhanced" and "Simple Textbox" editors.

This will also work when the sites are accessed through incloak.com, however there's a drawback - it will activate for **all** vBulletin sites, not just the sites listed in the manifest. 

This is because I can't find a good, reliable way of identifying the site from the page source code. 