!Date.prototype.format && (Date.prototype.format = function (fmt) {
    var format = fmt || "yyyy-MM-dd HH:mm:ss", year = this.getFullYear(),
      month = this.getMonth() + 1, date = this.getDate(),
      hour = this.getHours(), min = this.getMinutes(), second = this.getSeconds(), t = hour > 11 ? "PM" : "AM",
      joint = function (num) {
        return num < 10 ? ("0" + num) : num;
      };
    return format.replace(/[y]{4}/g, year)
      .replace(/[y]{2}/g, (year + "").substring(2))
      .replace(/[M]{2}/g, joint(month))
      .replace(/[M]{1}/g, month)
      .replace(/[d]{2}/g, joint(date))
      .replace(/[d]{1}/g, date)
      .replace(/[H]{2}/g, joint(hour))
      .replace(/[h]{2}/g, joint(hour % 12))
      .replace(/[m]{2}/g, joint(min))
      .replace(/[s]{2}/g, joint(second))
      .replace(/[t]{2}/g, t)
      .replace(/[t]{1}/g, t.substring(0, 1));
});