class Storage {
    storage = localStorage;
    getItem(key, defaultValue) {
        try {
            const data = this.storage.getItem(key);
            if (data) {
                const item = JSON.parse(data);
                return item;
            }
            return defaultValue;
        }
        catch (e) {
            console.log(e.messages);
            return defaultValue;
        }
    }
    setItem(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    }
    removeItem(key) {
        try {
            this.storage.removeItem(key);
        }
        catch (e) {
            console.log(e.messages);
        }
    }
}
export default new Storage();
