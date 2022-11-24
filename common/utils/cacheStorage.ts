import PubSub from "pubsub-js";

export const CacheManager = {
  data: new Map(),
  blockList: new Map(),

  wait<T>(key: any) {
    return new Promise<{ result: T; wait: boolean }>((resolve, reject) => {
      const data = this.data.get(key);

      if (data) {
        if (data?.error) {
          return reject(data.error);
        }

        return resolve({ result: data.value as T, wait: true });
      }

      if (this.blockList.get(key)) {
        return resolve({ result: null as T, wait: true });
      }

      this.blockList.set(key, true);
      return resolve({ result: null as T, wait: false });
    });
  },

  get<T>(key: any) {
    return new Promise<T>((resolve, reject) => {
      if (!this.blockList.get(key)) {
        const data = this.data.get(key);

        if (data) {
          if (data?.error) {
            return reject(data.error);
          }

          return resolve(data.value as T);
        }
      }

      const token = PubSub.subscribe(key, (msg, dataCallback) => {
        PubSub.unsubscribe(token);

        if (dataCallback.process === "done") {
          const data = dataCallback.value;
          resolve(data as T);
        }
        if (dataCallback.process === "error") {
          reject(dataCallback.error);
        }
      });
    });
  },

  set<T>(key: any, value: T, timeout?: number) {
    this.data.set(key, { value: value, error: null });
    this.blockList.set(key, false);

    PubSub.publish(key, { process: "done", value: value });
    if (timeout !== null && timeout !== undefined) {
      setTimeout(() => {
        this.delete(key);
      }, timeout);
    }
  },

  delete(key: any) {
    this.data.delete(key);
    this.blockList.set(key, false);
  },

  clear() {
    this.data.clear();
    this.blockList.clear();
  },

  error(key: any, error: any) {
    this.data.set(key, { value: null, error: error });
    this.blockList.set(key, false);

    PubSub.publish(key, { process: "error", error: error });
  },
};
