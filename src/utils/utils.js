import axios from "./axios";

export function formatBytes(a, b){
  if (0 == a) return "0 B";
  var c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c));
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

export function formateDate (date) {
  return new Date(parseInt(date)).toLocaleString().replace(/:\d{1,2}$/,' ');
}
