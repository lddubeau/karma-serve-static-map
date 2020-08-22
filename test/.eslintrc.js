"use strict";

module.exports = {
  extends: "../.eslintrc.js",
  env: {
    mocha: true,
  },
  rules: {
    "no-unused-expressions": ["off", "False positives with chai."],
  },
};
