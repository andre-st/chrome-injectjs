# Changelog

All notable changes to this project will be documented in this file.


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


