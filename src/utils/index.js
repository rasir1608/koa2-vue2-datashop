export default {
    isJsonString(objStr) {
        if (typeof objStr === 'string') {
            try {
                const obj = JSON.parse(objStr);
                if (typeof obj === 'object') {
                    if (Array.isArray(obj)) return false;
                    return true;
                } return false;
            } catch (er) {
                return false;
            }
        } else {
            return false;
        }
    },
    getRid(id) {
      let rid = Number(Date.now() + id).toString(36);
      while (rid.length < 8) {
        rid = `0${rid}`;
      }
      return rid;
    },
};