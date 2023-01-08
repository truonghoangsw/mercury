const storage = (() => {
  const setItem = (key, data) => {
    localStorage.setItem(
      key,
      data && typeof data === "object" ? JSON.stringify(data) : data
    );
    if (data === undefined) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, data && typeof data === 'object' ? JSON.stringify(data) : data);
  };

  const getItem = (key) => {
    let data = localStorage.getItem(key);
    try {
      data = JSON.parse(data);
      return data;
    } catch (error) {
      // console.error(error);
    }
    return data;
  };

  const removeItem = (key) => {
    localStorage.removeItem(key);
  };

  return {
    setItem,
    getItem,
    removeItem,
  };
})();

export default storage;
