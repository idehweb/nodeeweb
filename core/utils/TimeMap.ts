export default class TimeMap<K, V> {
  private map: Map<K, { value: V; modifyAt: Date }>;
  constructor() {
    this.map = new Map();
  }

  set(key: K, value: V) {
    this.map.set(key, { value, modifyAt: new Date() });
  }
  get(key: K): V | null {
    const value = this.map.get(key);
    if (!value) return null;
    return value.value;
  }
  getWithTime(key: K): { value: V; modifyAt: Date } | null {
    const value = this.map.get(key);
    if (!value) return null;
    return value;
  }
  clear() {
    return this.map.clear();
  }
  keys() {
    return [...this.map.keys()];
  }
  valuesWithTime() {
    return this.map.values();
  }
  values() {
    const values = [...this.map.values()];
    return values.map(({ value }) => value);
  }
}
