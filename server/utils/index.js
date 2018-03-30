module.exports = {
  getRid(id, len) {
    len = Number(len) < 8 ? 8 : len;
    let rid = Number(Date.now() + id).toString(36);
    while (rid.length < len) {
      rid = `0${rid}`;
    }
    return rid;
  },
};