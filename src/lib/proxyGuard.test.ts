import {
  CLIENT_HEADER,
  CLIENT_HEADER_VALUE,
  buildUpstreamPath,
  extractSessionToken,
  isSecureRequest,
  isTrustedRequest,
} from "./proxyGuard";

describe("buildUpstreamPath", () => {
  it("menerima path API yang valid", () => {
    expect(buildUpstreamPath(["api", "foods"])).toBe("api/foods");
    expect(buildUpstreamPath(["api", "glucose", "12"])).toBe("api/glucose/12");
    expect(buildUpstreamPath(["api", "auth", "login"])).toBe("api/auth/login");
  });

  it.each([
    [[]],
    [["api"]],
    [["admin", "users"]],
    [["api", ".."]],
    [["api", ".", "foods"]],
    [["api", ""]],
    [["api", "foods", "..%2F..%2Fsecret"]],
    [["api", "foods?x=1"]],
    [["api", "http:", "evil.com"]],
    [["api", "a/b"]],
  ])("menolak path berbahaya %j", (segments) => {
    expect(buildUpstreamPath(segments)).toBeNull();
  });
});

describe("isTrustedRequest", () => {
  const headers = (init: Record<string, string>) => new Headers(init);
  const marked = { [CLIENT_HEADER]: CLIENT_HEADER_VALUE, host: "app.test" };

  it("mengizinkan request baca tanpa pemeriksaan tambahan", () => {
    expect(isTrustedRequest("GET", headers({}))).toBe(true);
    expect(isTrustedRequest("HEAD", headers({}))).toBe(true);
  });

  it("menolak request yang mengubah data tanpa header penanda", () => {
    expect(isTrustedRequest("POST", headers({ host: "app.test" }))).toBe(false);
    expect(isTrustedRequest("DELETE", headers({ [CLIENT_HEADER]: "lain", host: "app.test" }))).toBe(false);
  });

  it("menerima request bertanda tanpa Origin atau dengan Origin yang sama", () => {
    expect(isTrustedRequest("POST", headers(marked))).toBe(true);
    expect(isTrustedRequest("put", headers({ ...marked, origin: "https://app.test" }))).toBe(true);
  });

  it("memakai x-forwarded-host bila ada", () => {
    const h = headers({ ...marked, host: "internal:3000", "x-forwarded-host": "app.test", origin: "https://app.test" });
    expect(isTrustedRequest("POST", h)).toBe(true);
  });

  it("menolak Origin dari situs lain atau yang tidak valid", () => {
    expect(isTrustedRequest("POST", headers({ ...marked, origin: "https://evil.test" }))).toBe(false);
    expect(isTrustedRequest("POST", headers({ ...marked, origin: "bukan-url" }))).toBe(false);
  });
});

describe("isSecureRequest", () => {
  it("mengenali HTTPS dari URL atau x-forwarded-proto", () => {
    expect(isSecureRequest("https://app.test/x", new Headers())).toBe(true);
    expect(isSecureRequest("http://app.test/x", new Headers())).toBe(false);
    expect(isSecureRequest("http://app.test/x", new Headers({ "x-forwarded-proto": "https" }))).toBe(true);
    expect(isSecureRequest("https://app.test/x", new Headers({ "x-forwarded-proto": "http" }))).toBe(false);
  });
});

describe("extractSessionToken", () => {
  it("mengambil token dan menghapusnya dari isi respons", () => {
    const res = extractSessionToken(JSON.stringify({ data: { user: { id: 1 }, token: "abc" } }));
    expect(res?.token).toBe("abc");
    expect(JSON.parse(res!.body)).toEqual({ data: { user: { id: 1 } } });
  });

  it.each([
    ["bukan json"],
    [JSON.stringify({ data: { user: {} } })],
    [JSON.stringify({ data: { token: "" } })],
    [JSON.stringify({ data: { token: 123 } })],
    [JSON.stringify({ error: "x" })],
  ])("mengembalikan null untuk %s", (text) => {
    expect(extractSessionToken(text)).toBeNull();
  });
});
