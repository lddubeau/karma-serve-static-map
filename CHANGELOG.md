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



