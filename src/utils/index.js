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
};