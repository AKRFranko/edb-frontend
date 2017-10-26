[![Build status](https://travis-ci.org/rocketsciencesolutions/wordpress-collect.svg?branch=master)](https://travis-ci.org/rocketsciencesolutions/wordpress-collect)

# \<wordpress-collect\>

The `wordpress-collect` element makes it possible to interact with the native [WP REST API](https://developer.wordpress.org/rest-api/reference/).

```html
<wordpress-collect
      base-url="https://cms.rocketscience.io"
      wp-api-url="wp-json/wp/v2"
      resource="pages"
      id="1"
      response="{{wpPages}}"></wordpress-collect>
```

The `base-url` attribute is the Wordpress url you want to retrieve the data from.
`wp-api-url` attribute is optional, this attribute will be placed after the `base-url`.
When the `wp-api-url` attribute is not defined it will always default to `wp-json/wp/v2`,
which is the default WP REST API segment. The `resource` attribute indicates the kind of resource to retrieve. This can be pages | posts or other resources defined in the [WP REST API reference](https://developer.wordpress.org/rest-api/reference/). When data is received the binding in the `response` attribute is updated with the retrieved data and available for use in the component which `wordpress-collect` is situated. In this case it can contain an Array or an Object depending on the request made.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.