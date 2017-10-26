iron-multi-ajax web component Polymer (2.X)
============

[![Build Status](https://travis-ci.org/RoXuS/iron-multi-ajax.svg?branch=master)](https://travis-ci.org/RoXuS/iron-multi-ajax)

`iron-multi-ajax` is an `iron-ajax` element which can use multi urls.

See the [component page](https://roxus.github.io/iron-multi-ajax/components/iron-multi-ajax/#iron-multi-ajax) for more information.

## Example with last-response property

```html
<link rel="import" href="bower_components/iron-multi-ajax/dist/iron-multi-ajax.html">

<iron-multi-ajax auto urls="[[aArrayOfUrls]]" last-response="{{data}}"></iron-multi-ajax>

// sync version
<iron-multi-ajax sync auto urls="[[aArrayOfUrls]]" last-response="{{data}}"></iron-multi-ajax>
```

## Example with event

```html
<link rel="import" href="bower_components/iron-multi-ajax/dist/iron-multi-ajax.html">

<iron-multi-ajax sync on-response="_handleResponse"></iron-multi-ajax>

```
```javascript
// Handle response in javascript
_handleResponse(event) {
  // Array of response
  const response = event.detail.response;
}
```

## Install

```
$ bower install iron-multi-ajax --save
```

## Serve component 

```
$ polymer serve --open
```

## Running Tests

```
$ polymer test
```

## Build dist

```
$ npm install
$ gulp build
```

## Development

To build the project on changes in the src folder
```
$ gulp watch
```

## License
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 of the License as published by the Free Software Foundation.
