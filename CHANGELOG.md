# [3.0.0](https://github.com/lddubeau/karma-serve-static-map/compare/v2.0.0...v3.0.0) (2021-11-04)


### Bug Fixes

* require legacy-peer-deps for newer npm versions ([34ac246](https://github.com/lddubeau/karma-serve-static-map/commit/34ac2464c8a946cd07f4171aab50ffe39c2f9776))
* upgrade packages together ([9d03db3](https://github.com/lddubeau/karma-serve-static-map/commit/9d03db3c365e5d28755d3670366895283cd26e3f))


### Build System

* no longer support Node 10 ([45a337a](https://github.com/lddubeau/karma-serve-static-map/commit/45a337af4b9e2b052b7023255b7263b908cc957c))


### BREAKING CHANGES

* We no longer support Node 10.



<a name="2.0.0"></a>
# [2.0.0](https://github.com/lddubeau/karma-serve-static-map/compare/v1.0.0...v2.0.0) (2019-12-24)


### Bug Fixes

* use resolve rather than join to process basePath and fsPath ([1e93d02](https://github.com/lddubeau/karma-serve-static-map/commit/1e93d02))


### BREAKING CHANGES

* we now use path.resolve rather than path.join to resolve the
fsPath relative to the basePath. Though it was an error to use path.join, the
fix may change the behavior of this package in some cases.



<a name="1.0.0"></a>
# 1.0.0 (2019-01-31)


### Features

* initial ([d30c0a5](https://github.com/lddubeau/karma-serve-static-map/commit/d30c0a5))



