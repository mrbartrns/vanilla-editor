class Storage {
  getItem(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const item = JSON.parse(data);
        return item;
      }
      return defaultValue;
    } catch (e) {
      console.log(e.messages);
      return defaultValue;
    }
  }

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.log(e.messages);
    }
  }
}

export default new Storage();
