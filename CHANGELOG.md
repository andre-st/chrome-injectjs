# Changelog

All notable changes to this project will be documented in this file.

**Note:**
This program is using the plugin-manifest V2,
and chrome will display an (deprecation) "error" although there is no real error.
It's just that Chrome's V2-support ends in 2023 and I'm not yet sure how to migrate to the very restricted V3.


## [0.8.3] - 2023-02-12
### Added:
- handles URL changes typical for single-page applications, 
  when the browser doesn't load a new page from the web
  but just updates the user interface (DOM) and the window-location URL
  (Note: URL redirection rules are ignored in such a case)


## [0.8.2] - 2022-04-06
### Changed:
- minor code improvements
### Fixed:
- no more spell checking in texteditor (red underlines)


## [0.8.0] - 2021-10-20
### Added:
- saveUrl() allows your mixin-code to trigger the download dialog for any resource with an URL
- simple text auto-completion with <kbd>Ctrl</kbd>+<kbd>Space</kbd> (too annoying without tabs and auto-completion)


## [0.6.0] - 2021-02-18
### Fixed:
- sample script 'Goodreads ratings on Amazon'

### Added:
- browser-action icon turns green if one of your mixins was injected into the active webpage


## [0.5.0] - 2021-02-03
### Fixed:
- sample script 'Goodreads ratings on Amazon', also ui improvements

### Added:
- getUrl() to replace Javascript's `fetch` command which causes Cross-Origin Read Blocking (CORB) errors in a mixin-function 
	(or Chrome content scripts in general)

### Changed:
- does not run mixins multiple times when there are multiple frames
- mixins scripts are not synchronized on other devices with Chrome; 
	otherwise there would be a limit to the script length


## [0.4.0] - 2018-08-28
### Added:

- pass multiple URLs to `mixin(...)`
- inject CSS code instead of Javascript by passing a template literal to `mixin(...)`
  (see script-example.js)


## [0.3.0] - 2018-08-17
### Added:

- redirect requests with `redir( ... )`


## [0.2.0] - 2018-05-27


