class Storage<T> {
  storage = localStorage;
  getItem(key: string, defaultValue: T) {
    try {
      const data = this.storage.getItem(key);
      if (data) {
        const item = JSON.parse(data);
        return item;
      }
      return defaultValue;
    } catch (e: any) {
      console.log(e.messages);
      return defaultValue;
    }
  }

  setItem(key: string, value: T) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    try {
      this.storage.removeItem(key);
    } catch (e: any) {
      console.log(e.messages);
    }
  }
}

export default new Storage();
