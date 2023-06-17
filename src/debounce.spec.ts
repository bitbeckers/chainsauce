import debounce from "./debounce";

describe("debounce", () => {
  jest.useFakeTimers();

  it("should debounce a function", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(500);
    debouncedFunc();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(500);
    debouncedFunc();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(1000);
    expect(func).toBeCalledTimes(1);
  });

  it("should debounce a function with arguments", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc("foo", "bar");
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(500);
    debouncedFunc("baz", "qux");
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(500);
    debouncedFunc("quux", "corge");
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(1000);
    expect(func).toBeCalledTimes(1);
    expect(func).toBeCalledWith("quux", "corge");
  });

  it("should not debounce a function if wait is negative", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, -1000);

    debouncedFunc();
    expect(func).toBeCalledTimes(1);
  });

  it("should not debounce a function if wait is zero", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 0);

    debouncedFunc();
    expect(func).toBeCalledTimes(1);
  });
});
