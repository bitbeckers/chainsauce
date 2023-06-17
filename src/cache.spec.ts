/** @jest-environment jsdom */

import Cache from "./cache";

interface LocalStorageMock {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  clear: () => void;
  removeItem: (key: string) => void;
  getAll: () => { [key: string]: string };
}

const localStorageMock: LocalStorageMock = (function () {
  let store: { [key: string]: string } = {};

  return {
    getItem(key: string): string | null {
      return store[key] ?? null;
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key: string) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Cache", () => {
  let cache: Cache;
  const obj = { content: "bar" };

  beforeEach(() => {
    cache = new Cache();
    // to fully reset the state between tests, clear the storage
    localStorageMock.clear();
  });

  it("should be able to get and set values", async () => {
    await cache.set("foo", JSON.stringify(obj));

    const result = await cache.get<{ content: string }>("foo");
    expect(result).toEqual(obj);
  });

  it("should return undefined for non-existent keys", async () => {
    const result = await cache.get<{ content: string }>("foo");
    expect(result).toBeUndefined();
  });

  it("should return undefined for invalid JSON", async () => {
    localStorageMock.setItem("foo", "invalid json");
    const result = await cache.get<string>("foo");
    expect(result).toBeUndefined();
  });

  it("should be able to cache a promise", async () => {
    const promise = Promise.resolve(obj);
    const result = await cache.lazy<{ content: string }>("foo", () => promise);
    expect(result).toEqual(obj);
  });

  it("should only call the function once for a given key", async () => {
    const promise = jest.fn(() => Promise.resolve(obj));
    const result1 = await cache.lazy<{ content: string }>("foo", promise);
    const result2 = await cache.lazy<{ content: string }>("foo", promise);
    expect(result1).toEqual(obj);
    expect(result2).toEqual(obj);
    expect(promise).toHaveBeenCalledTimes(1);
  });

  it("should return the cached value if available", async () => {
    await cache.set("foo", JSON.stringify(obj));
    const promise = jest.fn(() => Promise.resolve({ content: "baz" }));
    const result1 = await cache.lazy<{ content: string }>("foo", promise);
    const result2 = await cache.lazy<{ content: string }>("foo", promise);
    expect(result1).toEqual(obj);
    expect(result2).toEqual(obj);
    expect(promise).not.toHaveBeenCalled();
  });
});
