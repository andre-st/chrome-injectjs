# Chrome: Mix Custom Javascript Into Websites

![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)



## Customize a website when there is no native setting

There are other and better code injection extensions, e.g.,
[Dmitry Novikov's "User Javascript and CSS"](https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en-US).
However, you must entrust "sqdevil<span></span>@yandex.ru", "junkycoder" etc. with full control over the contents you retrieve on the Web every day. Chrome "content scripts" can modify websites, e.g. political content, exfiltrate private information and be attacked by the visited site.

My extension is tiny, it lacks any comfort and visual beauty.
No syntax highlighting or validation (Ace editor, jslint, ...).
Easy to inspect if you consider using it—no 3rd party libs, nothing [minified](https://en.wikipedia.org/wiki/Minification_(programming)).
No automatic updates (see Installation section).

In order to import / export settings you just copy/paste the content of the text area.


![Logo](image/icon128.png)

![Screenshot](image/screenshot-20180525.png)


## Installation (OS-independent)

1. not available in Chrome's Web Store
2. you cannot easily install CRX-files permanently from other sites
3. clone Git repository
4. Chrome > Settings > Extensions > [x] Developer mode (upper right corner)
5. Chrome > Settings > Extensions > click <kbd>Load unpacked extension</kbd> 
6. browse to the source directory of the downloaded, unarchived release and confirm

### Feedback:

Use [GitHub](https://github.com/andre-st/chrome-codemixins/issues) or see [AUTHORS.md](AUTHORS.md) file



## License

Creative Commons BY-SA

