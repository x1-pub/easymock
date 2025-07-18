export const validateJsonArray = (str) => {
  if (typeof str == 'string') {
    try {
      const obj = JSON.parse(str);
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          if (
            Object.prototype.toString.call(obj[i]).indexOf('Object]') === -1
          ) {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};
