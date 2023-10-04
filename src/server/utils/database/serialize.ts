export type Serialized<T> = {
  [key in keyof T]: T[key] extends Date
    ? string
    : T[key] extends object
    ? Serialized<T[key]>
    : T[key];
};

function serialize<T extends object>(obj: T): Serialized<T> {
  const res: { [key: string]: unknown } = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value instanceof Date) {
        res[key] = value.toISOString();
      } else if (typeof value === "object" && Array.isArray(value)) {
        res[key] = value.map((val) => serialize(val));
      } else if (typeof value === "object" && value instanceof Object) {
        res[key] = serialize(value);
      } else {
        res[key] = value;
      }
    }
  }
  return res as Serialized<T>;
}

export default serialize;
