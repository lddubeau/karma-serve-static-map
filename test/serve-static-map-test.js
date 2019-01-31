"use strict";

const { EventEmitter } = require("events");
const fs = require("fs");

const { expect, use } = require("chai");
const httpMocks = require("node-mocks-http");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const serveStaticMap = require("../lib/serve-static-map");

use(sinonChai);

const factory = serveStaticMap["middleware:serve-static-map"][1];

class Logger {
  // eslint-disable-next-line class-methods-use-this
  warn() {}
}

class LoggerFactory {
  // eslint-disable-next-line class-methods-use-this
  create(name) {
    return new Logger(name);
  }
}

async function getBufferedData(resp) {
  return new Promise((resolve) => {
    resp.on("end", () => {
      resolve(resp._getBuffer().toString());
    });
  });
}

function response() {
  return httpMocks.createResponse({ eventEmitter: EventEmitter });
}

function request(url) {
  return httpMocks.createRequest({
    method: "GET",
    url,
  });
}

function makeNext(sandbox) {
  const stub = sandbox.stub();
  let r;
  return {
    nextCalled: new Promise((resolve) => {
      r = resolve;
      stub.callsFake(r);
    }),
    next: stub,
  };
}

describe("serve-static-map", () => {
  let handler;
  let sandbox;
  let warnStub;
  let resp;
  let nextCalled;
  let next;

  before(() => {
    sandbox = sinon.createSandbox();
    warnStub = sandbox.stub(Logger.prototype, "warn");
    handler = factory({
      serveStaticMap: [
        { fsPath: ".", baseURL: "/fnord/" },
        { fsPath: "./test", baseURL: "/foo/" },
      ],
    }, new LoggerFactory());
  });

  beforeEach(() => {
    resp = response();
    ({ nextCalled, next } = makeNext(sandbox));
  });

  afterEach(() => {
    sandbox.reset();
  });

  after(() => {
    sandbox.restore();
  });

  it("serves files", async () => {
    handler(request("/fnord/package.json"), resp, next);

    expect(await getBufferedData(resp)).to
      .equal(fs.readFileSync("./package.json").toString());
    expect(next).to.not.have.been.called;
    expect(warnStub).to.not.have.been.called;

    const respB = response();
    handler(request("/foo/serve-static-map-test.js"), respB, next);

    expect(await getBufferedData(respB)).to
      .equal(fs.readFileSync("./test/serve-static-map-test.js").toString());
    expect(next).to.not.have.been.called;
    expect(warnStub).to.not.have.been.called;
  });

  it("resolves relative to basePath", async () => {
    const relativeHandler = factory({
      basePath: "test",
      serveStaticMap: [
        { fsPath: "..", baseURL: "/fnord/" },
        // This mapping also tests that baseURL is treated as a directory.
        // The lack of slash at the end is handled internally.
        { fsPath: ".", baseURL: "/foo" },
      ],
    }, new LoggerFactory());

    relativeHandler(request("/fnord/package.json"), resp, next);

    expect(await getBufferedData(resp)).to
      .equal(fs.readFileSync("./package.json").toString());
    expect(next).to.not.have.been.called;
    expect(warnStub).to.not.have.been.called;

    const respB = response();
    relativeHandler(request("/foo/serve-static-map-test.js"), respB, next);

    expect(await getBufferedData(respB)).to
      .equal(fs.readFileSync("./test/serve-static-map-test.js").toString());
    expect(next).to.not.have.been.called;
    expect(warnStub).to.not.have.been.called;
  });

  describe("calls next when", () => {
    it("the file is within a baseURL but does not exist", async () => {
      handler(request("/fnord/nonexistent.json"), resp, next);

      await nextCalled;

      expect(next).to.have.been.calledOnce;
      expect(warnStub).to.not.have.been.called;
    });

    it("the file is not within a baseURL", async () => {
      handler(request("/not-mapped/nonexistent.json"), resp, next);

      await nextCalled;

      expect(next).to.have.been.calledOnce;
      expect(warnStub).to.not.have.been.called;
    });
  });

  describe("when no configuration is passed", () => {
    it("warns", () => {
      factory({}, new LoggerFactory());
      expect(warnStub).to.have.been.calledOnce.and
        .calledWith("no serveStaticMap option was provided; using a no-op \
configuration, which is probably not what you want");
    });

    it("passes requests through", async () => {
      const noop = factory({}, new LoggerFactory());
      noop(request("/foo"), resp, next);

      await nextCalled;

      expect(next).to.have.been.calledOnce;
    });
  });
});
