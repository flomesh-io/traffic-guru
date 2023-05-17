import api from "@/services/api";
import { request, METHOD } from "@/utils/request";

export function clickhouseCount(table, where) {
  let SQL = `select count() from ${table} where 1=1 ${where};`;
  return request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET);
}
export function clickhouseQuery(table, fields, where, pageNo, pageSize) {
  let SQL = `select ${fields} from ${table} where 1=1 ${where} order by timestamp DESC LIMIT ${
    (pageNo - 1) * pageSize
  },${pageSize}; `;
  const result = request(api.CLICKHOUSE.QUERY(SQL), METHOD.GET);
  return result;
}
export function clickhouseFormat(result, fields) {
  if (result.status != 200) {
    return;
  }
  const keys = fields.split(",")
  const datas = []
  const lines = result.data.split("\n")
  for (const line of lines) {
    if (!line) break;
    const data = {}
    const lineData = line.split("\t")
    for (let [index, key] of keys.entries()) {
      if (key == "timestamp") {
        data[key] = new Date(Number(lineData[index])).toLocaleString()
      } else if (key == "message") {
        data[key] = JSON.parse(lineData[index])
      } else {
        data[key] = lineData[index]
      }
    }
    datas.push(data)
  }
  
  result.data = datas
  
}

export default {
  clickhouseCount,
  clickhouseQuery,
  clickhouseFormat,
};
