'use strict';

/**
 * trafficlog service
 */
const axios = require('axios');
const { createCoreService } = require('@strapi/strapi').factories;
const pg = require('pg');

module.exports = createCoreService('api::trafficlog.trafficlog',{
  /**
   * get log fleet
   */
  async getLogFleet() {
    const logConf = await strapi.db.query('api::fleet.fleet').findOne({ where: { type: 'log', apply: true } });
    if (logConf == null || logConf.length == 0) {
      throw new Error('no log conf');
    }
    const fleet = await strapi.db.query('api::fleet.fleet').findOne({ where: { id: logConf.content.bind.id } });
    if (fleet == null || fleet.length == 0) {
      throw new Error('no db conf');
    }
    return fleet;
  },

  /**
   * save logs
   */
  async logs2Clickhouse(reqBody) {
    const logs = reqBody.split('\n');
    return {
      "data": logs
    };
  },
  async logs2Postgresql(reqBody, dbConf) {
    const logs = reqBody.split('\n');
    const connStr = `tcp://${dbConf.user}:${dbConf.password}@${dbConf.host}:${dbConf.port}/${dbConf.database}`;
    const pgClient =  new pg.Client(connStr);
    pgClient.connect();
    const baseSql = `
    INSERT INTO trafficlogs (req_size, res_size, req_time, res_time, end_time, 
    remote_addr, local_addr, remote_port, local_port, req_path, req_method, req_protocol,
    req_headers, res_status, service_name, pod_name, mesh_name, cluster_name, bond_type, message)  
     VALUES 
     `
    let valueSql = '';
    for (let index = 0; index < logs.length; index++) {
      if(index>0){
        valueSql += ',';
      }
      if(logs[index]){
        const log = JSON.parse(logs[index]);
        valueSql += `
        (
           ${log.reqSize}, ${log.resSize}, ${log.reqTime}, ${log.resTime}, ${log.endTime}, 
          '${log.remoteAddr}', '${log.localAddr}', ${log.remotePort}, ${log.localPort}, 
          '${log.req.path}', '${log.req.method}', '${log.req.protocol}', '${JSON.stringify(log.req.headers)}', ${log.res.status}, 
          '${log.service.name}', '${log.pod.name}', '${log.meshName}', '${log.clusterName}', '${log.type}',
          '
          ${logs[index]}
          '
        ) 
        `;
      }
    }
    console.debug(baseSql + valueSql);
    await pgClient.query(baseSql + valueSql)
      .then(() => pgClient.end());
    return {msg: 'ok'}
  },

  /**
   * query logs
   */
  async queryLogs2Clickhouse(reqBody, dbConf) {
    let baseSql = `
        SELECT service.name as serviceName, pod.name as podName, 
            req.path as reqPath, req.method as reqMethod, req.protocol as reqProtocol,
            resTime, reqTime, res.status as resStatus, resSize,
            remoteAddr, remotePort, localAddr, localPort,
            timestamp as createdAt, req.headers as reqHeaders, message
        FROM log
        WHERE  bondType != 'outbound'
        `;
    if (reqBody?.customQuery) {
      baseSql += " AND (" + reqBody.customQuery + ") ";
    }
    if (reqBody?.reqTimeFrom) {
      baseSql += " AND reqTime > " + reqBody.reqTimeFrom;
    }
    if (reqBody?.reqTimeTo) {
      baseSql += " AND reqTime < " + reqBody.reqTimeTo;
    }
    let orderByField = "resTime";
    if (reqBody?.orderByField) {
      orderByField = reqBody.orderByField;
    }
    let orderByType = "desc";
    if (reqBody?.orderByType) {
      orderByType = reqBody.orderByType;
    }
    let limitSize = 10
    if (reqBody?.pageSize) {
      limitSize = reqBody.pageSize;
    }
    let limitStart = 0;
    if (reqBody?.pageNo) {
      limitStart = reqBody.pageNo * limitSize;
    }
    const querySql = `${baseSql} ORDER BY ${orderByField} ${orderByType} LIMIT ${limitStart}, ${limitSize}  format JSON`;
    const queryRes = await dbQuery4Clickhouse(dbConf, querySql);
    return {
      "data": queryRes.data.data,
      "total": queryRes.data.rows_before_limit_at_least
    };
  },
  async queryLogs2Postgresql(reqBody, dbConf) {
    const connStr = `tcp://${dbConf.user}:${dbConf.password}@${dbConf.host}:${dbConf.port}/${dbConf.database}`;
    const pgClient =  new pg.Client(connStr);
    pgClient.connect();
    const resData = {};
    let baseSql = `
    SELECT service_name "serviceName", pod_name "podName", req_path "reqPath", req_method "reqMethod", 
      req_protocol "reqProtocol", res_time "resTime", req_time "reqTime", res_status "resStatus", 
      res_size "resSize", remote_addr "remoteAddr", remote_port "remotePort", local_addr "localAddr", 
      local_port "localPort", created_at "createAt", req_headers "reqHeaders", message
		FROM trafficlogs
		WHERE  bond_type != 'outbound'
    `;
    if (reqBody?.customQuery) {
      baseSql += " AND (" + reqBody.customQuery + ") ";
    }
    if (reqBody?.reqTimeFrom) {
      baseSql += " AND req_time > " + reqBody.reqTimeFrom;
    }
    if (reqBody?.reqTimeTo) {
      baseSql += " AND req_time < " + reqBody.reqTimeTo;
    }
    const countSql = `SELECT count(1) AS total FROM (${baseSql}) abc`;
    await pgClient.query(countSql)
      .then((result) => resData.total = result.rows[0].total);

    let orderByField = "req_time";
    if (reqBody?.orderByField) {
      orderByField = _PG_ORDER_FIELDS_MAP.get(reqBody.orderByField);
    }
    let orderByType = "desc";
    if (reqBody?.orderByType) {
      orderByType = reqBody.orderByType;
    }
    let limitSize = 10
    if (reqBody?.pageSize) {
      limitSize = reqBody.pageSize;
    }
    let limitStart = 0;
    if (reqBody?.pageNo) {
      limitStart = reqBody.pageNo * limitSize;
    }
    const querySql = `${baseSql} ORDER BY ${orderByField} ${orderByType} LIMIT ${limitSize} OFFSET ${limitStart} `;
    //console.debug(querySql)
    await pgClient.query(querySql)
      .then((result) => resData.data = result.rows)
      .then(() => pgClient.end());
    return resData;
  },

  /**
   * query logs for svc
   */
  async querySvcLogs2Clickhouse(reqBody, dbConf) {
    let baseSql = `
        SELECT service.name as serviceName, pod.name as podName, 
            req.path as reqPath, req.method as reqMethod, req.protocol as reqProtocol,
            resTime, reqTime, res.status as resStatus, resSize,
            remoteAddr, remotePort, localAddr, localPort,
            timestamp as createdAt, req.headers as reqHeaders, message
        FROM log
        WHERE  bondType != 'outbound'
        `;
    baseSql += buildWhereSql4Clickhouse(reqBody);
    let limitSize = 10
    if (reqBody?.pageSize) {
      limitSize = reqBody.pageSize;
    }
    let limitStart = 0;
    if (reqBody?.pageNo) {
      limitStart = reqBody.pageNo * limitSize;
    }
    const querySql = `${baseSql} ORDER BY resTime desc LIMIT ${limitStart}, ${limitSize}  format JSON`;
    const queryRes = await dbQuery4Clickhouse(dbConf, querySql);
    return {
      "data": queryRes.data.data,
      "total": queryRes.data.rows_before_limit_at_least
    };
  },
  async querySvcLogs2Postgresql(reqBody, dbConf) {
    const connStr = `tcp://${dbConf.user}:${dbConf.password}@${dbConf.host}:${dbConf.port}/${dbConf.database}`;
    const pgClient =  new pg.Client(connStr);
    pgClient.connect();
    const resData = {};
    let baseSql = `
    SELECT service_name "serviceName", pod_name "podName", req_path "reqPath", req_method "reqMethod", 
      req_protocol "reqProtocol", res_time "resTime", req_time "reqTime", res_status "resStatus", 
      res_size "resSize", remote_addr "remoteAddr", remote_port "remotePort", local_addr "localAddr", 
      local_port "localPort", created_at "createAt", req_headers "reqHeaders", message
		FROM trafficlogs
		WHERE  bond_type != 'outbound'
    `;
    baseSql += buildWhereSql4Postgresql(reqBody);
    console.debug(baseSql)
    const countSql = `SELECT count(1) AS total FROM (${baseSql}) abc`;
    await pgClient.query(countSql)
      .then((result) => resData.total = result.rows[0].total);
    let limitSize = 10
    if (reqBody?.pageSize) {
      limitSize = reqBody.pageSize;
    }
    let limitStart = 0;
    if (reqBody?.pageNo) {
      limitStart = reqBody.pageNo * limitSize;
    }
    const querySql = `${baseSql} ORDER BY res_time desc LIMIT ${limitSize} OFFSET ${limitStart} `;
    await pgClient.query(querySql)
      .then((result) => resData.data = result.rows)
      .then(() => pgClient.end());
    return resData;
  },

  /**
   * count latency
   */
  async countLatency2Clickhouse(reqBody, dbConf) {
    let baseSql = `
    SELECT (CEIL ((resTime - reqTime)/ 500)) AS latency, COUNT(1) as count
    FROM log
    WHERE bondType != 'outbound'
    `;
    baseSql += buildWhereSql4Clickhouse(reqBody);
    const querySql = `${baseSql}  GROUP BY latency ORDER BY latency format JSON`;
    // console.debug(querySql)
    const queryRes = await dbQuery4Clickhouse(dbConf, querySql);
    return {
      "data": queryRes.data.data
    };
  },
  async countLatency2Postgresql(reqBody, dbConf) {
    const connStr = `tcp://${dbConf.user}:${dbConf.password}@${dbConf.host}:${dbConf.port}/${dbConf.database}`;
    const pgClient =  new pg.Client(connStr);
    pgClient.connect();
    const resData = {};
    let baseSql = `
    SELECT (CEIL ((res_time - req_time)/ 500)) AS latency, COUNT(1) as count
    FROM trafficlogs
    WHERE bond_type != 'outbound'    
    `;
    baseSql += buildWhereSql4Postgresql(reqBody);
    const querySql = `${baseSql}  GROUP BY latency ORDER BY latency `;
    // console.debug(querySql)
    await pgClient.query(querySql)
      .then((result) => resData.data = result.rows)
      .then(() => pgClient.end());
    return resData;
  },

  /**
   * count status
   */
  async countStatus2Clickhouse(reqBody, dbConf) {
    let baseSql = `
    SELECT COUNT(1) AS count, res.status status
    FROM log
    WHERE bondType != 'outbound'
    `;
    baseSql += buildWhereSql4Clickhouse(reqBody);
    const querySql = `${baseSql}  AND status > '0' GROUP BY status ORDER BY status format JSON`;
    const queryRes = await dbQuery4Clickhouse(dbConf, querySql);
    return {
      "data": queryRes.data.data
    };
  },
  async countStatus2Postgresql(reqBody, dbConf) {
    const connStr = `tcp://${dbConf.user}:${dbConf.password}@${dbConf.host}:${dbConf.port}/${dbConf.database}`;
    const pgClient =  new pg.Client(connStr);
    pgClient.connect();
    const resData = {};
    let baseSql = `
    SELECT COUNT(1) as count, res_status status
    FROM trafficlogs
    WHERE bond_type != 'outbound'    
    `;
    baseSql += buildWhereSql4Postgresql(reqBody);
    const querySql = `${baseSql}  AND res_status > '0' GROUP BY res_status ORDER BY res_status `;
    // console.debug(querySql)
    await pgClient.query(querySql)
      .then((result) => resData.data = result.rows)
      .then(() => pgClient.end());
    return resData;
  },

  /**
   * count tps
   */
  async countTps2Clickhouse(reqBody, dbConf) {
    let baseSql = `
    SELECT COUNT(1) AS tps,
      toStartOfInterval(toDateTime(resTime / 1000), interval 1 minute) as minute
    FROM log
    WHERE bondType != 'outbound'
    `;
    baseSql += buildWhereSql4Clickhouse(reqBody);
    const querySql = `${baseSql} GROUP BY minute ORDER BY minute ASC format JSON`;
    const queryRes = await dbQuery4Clickhouse(dbConf, querySql);
    return {
      "data": queryRes.data.data
    };
  },
  async countTps2Postgresql(reqBody, dbConf) {
    const connStr = `tcp://${dbConf.user}:${dbConf.password}@${dbConf.host}:${dbConf.port}/${dbConf.database}`;
    const pgClient =  new pg.Client(connStr);
    pgClient.connect();
    const resData = {};
    let baseSql = `
    SELECT COUNT(1) AS tps,
      to_char(to_timestamp("res_time" / 1000), 'yyyy-MM-dd hh24:MI:00') as minute
    FROM trafficlogs
    WHERE bond_type != 'outbound'    
    `;
    baseSql += buildWhereSql4Postgresql(reqBody);
    const querySql = `${baseSql} GROUP BY minute ORDER BY minute ASC `;
    // console.debug(querySql)
    await pgClient.query(querySql)
      .then((result) => resData.data = result.rows)
      .then(() => pgClient.end());
    return resData;
  },
  
  /**
   * total tps
   */
  async totalTps2Clickhouse(reqBody, dbConf) {
    let baseSql = `
    SELECT COUNT(1) AS totalTps
    FROM log
    WHERE bondType != 'outbound'
    `;
    baseSql += buildWhereSql4Clickhouse(reqBody);
    const querySql = `${baseSql} format JSON`;
    const queryRes = await dbQuery4Clickhouse(dbConf, querySql);
    return {
      "data": queryRes.data.data
    };
  },
  async totalTps2Postgresql(reqBody, dbConf) {
    const connStr = `tcp://${dbConf.user}:${dbConf.password}@${dbConf.host}:${dbConf.port}/${dbConf.database}`;
    const pgClient =  new pg.Client(connStr);
    pgClient.connect();
    const resData = {};
    const baseSql = `
    SELECT COUNT(1) AS totalTps
    FROM trafficlogs
    WHERE bond_type != 'outbound'    
    `;
    const querySql = baseSql + buildWhereSql4Postgresql(reqBody);
    // console.debug(querySql)
    await pgClient.query(querySql)
      .then((result) => resData.data = result.rows)
      .then(() => pgClient.end());
    return resData;
  },
  
  async getErrStatusAlarms(scaleTime) {
    const alarms = [];
    const errStatusLogs = await strapi.service("api::clickhouse.clickhouse").query(`
      SELECT x_parameters.aid, toString(toDateTime(reqTime/1000)), res.status
      FROM log
      WHERE timestamp > toDateTime(toUnixTimestamp(now64())-${scaleTime})
      AND res.status >= 400
    `);

    if (errStatusLogs == 0) {
      return alarms;
    }
    for (const errLog of errStatusLogs.split('\n')) {
      if (
        typeof errLog === 'undefined' ||
        errLog === null ||
        errLog === '' ||
        errLog.length == 0
      ) {
        continue;
      }
      const alarmItemFields = errLog.split('\t');
      const alarmItem = {};
      alarmItem.aid = alarmItemFields[0];
      alarmItem.reqTime = alarmItemFields[1];
      alarmItem.resStatus = alarmItemFields[2];
      alarms.push(alarmItem);
    }
    return alarms;
  },
});

function buildWhereSql4Postgresql(reqBody) {
  let whereSql = '';
  if (reqBody?.serviceName) {
    whereSql += " AND service_name = '" + reqBody.serviceName + "' ";
  }
  if (reqBody?.queryWords) {
    whereSql = whereSql + " AND cast(message AS varchar) like '%" + reqBody.queryWords + "%' ";
  }
  if (reqBody?.reqTimeFrom) {//e.g. reqTimeFrom=15 day
    whereSql += " AND to_timestamp(req_time / 1000) > (now() - interval '" + reqBody.reqTimeFrom + "') ";
  }
  if (reqBody?.reqTimeTo) { //e.g. reqTimeTo=1 second
    whereSql += " AND to_timestamp(req_time / 1000) < (now() - interval '" + reqBody.reqTimeTo + "') ";
  }
  return whereSql
}

function buildWhereSql4Clickhouse(reqBody) {
  let whereSql = '';
  if (reqBody?.serviceName) {
    whereSql += " AND service.name = '" + reqBody.serviceName + "' ";
  }
  if (reqBody?.queryWords) {
    whereSql = whereSql + " AND message like '%25" + reqBody.queryWords + "%25' ";
  }
  if (reqBody?.reqTimeFrom) {//e.g. reqTimeFrom=15 day
    whereSql += " AND toDateTime(reqTime / 1000) > (now() - interval " + reqBody.reqTimeFrom + ") ";
  }
  if (reqBody?.reqTimeTo) { //e.g. reqTimeTo=1 second
    whereSql += " AND toDateTime(reqTime / 1000) < (now() - interval " + reqBody.reqTimeTo + ") ";
  }
  return whereSql
}

async function dbQuery4Clickhouse(dbConf, querySql) {
  const queryUrl = `http://${dbConf.host}:${dbConf.port}?database=${dbConf.database}&query=${querySql}`;
  // console.debug(queryUrl);
  if (dbConf.user) {
    const base64Str = new Buffer.from(dbConf.user + ':' + dbConf.password).toString('base64');
    return await axios({
      method: 'get',
      url: queryUrl,
      headers: { Authorization: 'Basic ' + base64Str },
    });
  } else {
    return await axios({
      method: 'get',
      url: queryUrl,
    });
  } 
}

const _PG_ORDER_FIELDS_MAP = new Map();
_PG_ORDER_FIELDS_MAP.set("serviceName", "service_name");
_PG_ORDER_FIELDS_MAP.set("podName", "pod_name");
_PG_ORDER_FIELDS_MAP.set("reqPath", "req_path");
_PG_ORDER_FIELDS_MAP.set("reqMethod", "req_method");
_PG_ORDER_FIELDS_MAP.set("reqProtocol", "req_protocol");
_PG_ORDER_FIELDS_MAP.set("resTime", "res_time");
_PG_ORDER_FIELDS_MAP.set("reqTime", "req_time");
_PG_ORDER_FIELDS_MAP.set("resStatus", "res_status");
_PG_ORDER_FIELDS_MAP.set("resSize", "res_size");
_PG_ORDER_FIELDS_MAP.set("remoteAddr", "remote_addr");
_PG_ORDER_FIELDS_MAP.set("remotePort", "remote_port");
_PG_ORDER_FIELDS_MAP.set("localAddr", "local_addr");
_PG_ORDER_FIELDS_MAP.set("localPort", "local_port");
_PG_ORDER_FIELDS_MAP.set("createAt", "created_at");
_PG_ORDER_FIELDS_MAP.set("reqHeaders", "req_headers");

