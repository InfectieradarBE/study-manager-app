// TODO move to an util package

export function fields<T>() {
    return new Proxy(
      {},
      {
        get: function (_target, prop, _receiver) {
          return prop;
        },
      },
    ) as {
      [P in keyof T]: P;
    };
  }