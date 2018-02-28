Summary
-------
Settings app for webOS Open Source Edition

Description
-----------
This app allows you to change the Settings of webOS Open Source Edition.

Settings App Menu
-----------
### General
- Language
	- Menu Language
	- Keyboard Languages

- Time & Date
	- Set Automatically
	- Time
	- Date
	- TimeZone

- System Information
	- Device Name
	- Software Version
	- Mac Address

### Network
- Device Name
- Wired Connection
	- Connection
	- TCP / IP properties
	- EDIT

- Wi-Fi Connection
	- Wi-Fi List
	- Add a Hidden Wireless Network
	- Connect via WPS PBC
	- Connect via WPS PIN
	- Advanced Wi-Fi Settings

How to Build
=====================

## Dependencies
This app was created using Enact framework.
The following tools and libraries are required to build app:

```
* Node
* NPM
* enact-cli
```

Noticing some intermittent errors depending on your node/npm version.
We've seen it work with node 4.4.7 and npm 2.15.8 and node 6.5.0 and npm 3.10.3.

## Building

Acquire the Source
Download the app source code from a this repository.

Install the Dependencies

Navigate to the app's root directory (the base directory with the package.json). From there, you can use one of the documented techniques for reusing node module dependencies, or you can install the dependencies the basic way:

```
    $ npm install
```

Available Commands
-----------------------

Enact supports several commands, each accessible through the `enact` command and through npm aliases in `package.json`. For help on individual commands, add `--help` following the command name. The commands are:

### `enact serve` (aliased as `npm run serve`)

Builds and serves the app in the development mode.
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.

### `enact pack` (aliased as `npm run pack`, `npm run pack-p`, and `npm run watch`)

Builds the project in the working directory. Specifically, `pack` builds in development mode with code un-minified and with debug code included, whereas `pack-p` builds in production mode, with everything minified and optimized for performance. Be sure to avoid shipping or performance testing on development mode builds.

### `enact clean` (aliased as `npm run clean`)

Deletes previous build fragments from ./dist.

### `enact lint` (aliased as `npm run lint`)

Runs the Enact configuration of ESLint on the project for syntax analysis.

### `enact test` (aliased as `npm run test`, `npm run test-json`, and `npm run test-watch`)

These tasks will execute all valid tests (files that end in `-specs.js`) that are within the project directory. The `test` is a standard execution pass, `test-json` uses a json reporter for output, and `test-watch` will set up a watcher to re-execute tests when files change.

### `enact license` (aliased as `npm run license`)

Outputs a JSON representation of the licenses for modules referenced by the current project as well as any licenses of modules used by `@enact/cli` that may be included in a production build of an app.

# Copyright and License Information

Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2016-2018 LG Electronics, Inc.

Unless otherwise specified or set forth in the NOTICE file, all content,
including all source code files and documentation files in this repository are:
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this content except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
