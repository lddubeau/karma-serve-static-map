"use strict";

const path = require("path");
const serveStatic = require("serve-static");

function middlewareFactory(config, loggerFactory) {
  const logger = loggerFactory.create("serve-static-map");
  const basePath = path.normalize(config.basePath || "");
  const opts = config.serveStaticMap;
  if (!opts) {
    logger.warn("no serveStaticMap option was provided; using a no-op \
configuration, which is probably not what you want");
    return (req, resp, next) => next();
  }

  const servers = opts.map(({ baseURL, ...rest }) => ({
    baseURL: baseURL.endsWith("/") ? baseURL : `${baseURL}/`,
    ...rest,
    serve: serveStatic(path.join(basePath, rest.fsPath), {
      index: false,
    }),
  }));

  return function handle(req, resp, next) {
    const { url } = req;
    for (const { baseURL, serve } of servers) {
      if (url.startsWith(baseURL)) {
        req.url = url.slice(baseURL.length);
        serve(req, resp, next);
        return;
      }
    }

    next();
  };
}

middlewareFactory.$inject = [
  "config",
  "logger",
];

module.exports = {
  "middleware:serve-static-map": ["factory", middlewareFactory],
};
