# karma-serve-static-map

Individually map multiple locations on the local filesystem to multiple base
URLs in Karma.

Under the hood, this plugin uses the [serve-static
middleware](https://github.com/expressjs/serve-static).

## Installation
Install ``karma-serve-static-map`` as a ``devDependency`` in your package.json:

```bash
npm i -D karma-serve-static-map
```

## Usage

module.exports = function configure(config) {
  config.set({
    middleware: ["serve-static-map"],
    serveStaticMap: [
      { fsPath: ".", baseURL: "/fnord/" },
      { fsPath: "./test", baseURL: "/foo/" },
    ],
  });
};

The ``serveStaticMap`` configuration option is an array whose elements sets up a
mapping from a URL to a file system location. Each element has the fields:

* ``fsPath``: this is the location in the file system from which to serve files
  It must be a directory. These paths are resolve relative to the ``basePath``
  of the Karma configuration.

* ``baseURL``: the URL at which the static files are anchored. This is
  interpreted as a directory by ``serve-static-map``.
