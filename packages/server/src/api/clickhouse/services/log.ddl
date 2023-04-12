CREATE TABLE default.log
(

    `rid` UInt64 DEFAULT JSONExtractInt(message,
 'rid'),

    `sid` UInt64 DEFAULT JSONExtractInt(message,
 'sid'),

    `iid` String DEFAULT JSONExtractString(message,
 'iid'),

    `dir` String DEFAULT JSONExtractString(message,
 'dir'),

    `proto` String DEFAULT JSONExtractString(message,
 'proto'),

    `req` String DEFAULT JSONExtractRaw(message,
 'req'),

    `req.id` String DEFAULT JSONExtractString(req,
 'id'),

    `req.protocol` String DEFAULT JSONExtractString(req,
 'protocol'),

    `req.version` String DEFAULT JSONExtractString(req,
 'version'),

    `req.service.version` String DEFAULT JSONExtractString(req,
 'service.version'),

    `req.method.name` String DEFAULT JSONExtractString(req,
 'method.name'),

    `req.method.type` String DEFAULT JSONExtractString(req,
 'method.type'),

    `req.method` String DEFAULT JSONExtractString(req,
 'method'),

    `req.path` String DEFAULT JSONExtractString(req,
 'path'),

    `req.headers` String DEFAULT JSONExtractRaw(req,
 'headers'),

    `req.service.name` String DEFAULT JSONExtractString(req.headers,
 'serviceidentity'),

    `req.body` String DEFAULT JSONExtractString(req,
 'body'),

    `res` String DEFAULT JSONExtractRaw(message,
 'res'),

    `res.protocol` String DEFAULT JSONExtractString(res,
 'protocol'),

    `res.type` Int32 DEFAULT JSONExtractInt(res,
 'type'),

    `res.value` String DEFAULT JSONExtractString(res,
 'value'),

    `res.status` UInt32 DEFAULT JSONExtractInt(res,
 'status'),

    `res.statusText` String DEFAULT JSONExtractString(res,
 'statusText'),

    `res.headers` String DEFAULT JSONExtractRaw(res,
 'headers'),

    `res.body` String DEFAULT JSONExtractString(res,
 'body'),

    `reqTime` UInt64 DEFAULT JSONExtractInt(message,
 'reqTime'),

    `resTime` UInt64 DEFAULT JSONExtractInt(message,
 'resTime'),

    `reqSize` UInt64 DEFAULT JSONExtractInt(message,
 'reqSize'),

    `resSize` UInt64 DEFAULT JSONExtractInt(message,
 'resSize'),

    `localAddr` String DEFAULT JSONExtractString(message,
 'localAddr'),

    `localPort` UInt32 DEFAULT JSONExtractInt(message,
 'localPort'),

    `remoteAddr` String DEFAULT JSONExtractString(message,
 'remoteAddr'),

    `remotePort` UInt32 DEFAULT JSONExtractInt(message,
 'remotePort'),

    `node` String DEFAULT JSONExtractRaw(message,
 'node'),

    `node.ip` String DEFAULT JSONExtractString(node,
 'ip'),

    `node.name` String DEFAULT JSONExtractString(node,
 'name'),

    `pod` String DEFAULT JSONExtractRaw(message,
 'pod'),

    `pod.ns` String DEFAULT JSONExtractString(pod,
 'ns'),

    `pod.ip` String DEFAULT JSONExtractString(pod,
 'ip'),

    `pod.name` String DEFAULT JSONExtractString(pod,
 'name'),

    `service` String DEFAULT JSONExtractRaw(message,
 'service'),

    `service.name` String DEFAULT JSONExtractString(service,
 'name'),

    `target` String DEFAULT JSONExtractRaw(message,
 'target'),

    `target.address` String DEFAULT JSONExtractString(target,
 'address'),

    `target.port` UInt32 DEFAULT JSONExtractInt(target,
 'port'),

    `trace` String DEFAULT JSONExtractRaw(message,
 'trace'),

    `trace.id` String DEFAULT JSONExtractString(trace,
 'id'),

    `trace.span` String DEFAULT JSONExtractString(trace,
 'span'),

    `trace.parent` String DEFAULT JSONExtractString(trace,
 'parent'),

    `trace.sampled` String DEFAULT JSONExtractString(trace,
 'sampled'),

    `env` String DEFAULT JSONExtractRaw(message,
 'env'),

    `x_parameters` String DEFAULT JSONExtractRaw(message,
 'x_parameters'),

    `x_parameters.aid` UInt64 DEFAULT JSONExtractInt(x_parameters,
 'aid'),

    `x_parameters.a4lbid` UInt64 DEFAULT JSONExtractInt(x_parameters,
 'a4lbid'),

    `x_parameters.pid` UInt64 DEFAULT JSONExtractInt(x_parameters,
 'pid'),

    `x_parameters.igid` UInt64 DEFAULT JSONExtractInt(x_parameters,
 'igid'),

    `x_parameters.sid` UInt64 DEFAULT JSONExtractInt(x_parameters,
 'sid'),

    `x_parameters.target_sid` UInt64 DEFAULT JSONExtractInt(x_parameters,
 'target_sid'),

    `x_parameters.7lbid` UInt64 DEFAULT JSONExtractInt(x_parameters,
 '7lbid'),

    `x_parameters.4lbid` UInt64 DEFAULT JSONExtractInt(x_parameters,
 '4lbid'),

    `x_parameters.appid` UInt64 DEFAULT JSONExtractInt(x_parameters,
 'appid'),

    `x_parameters.pipyname` String DEFAULT JSONExtractString(x_parameters,
 'pipyname'),

    `bondType` String DEFAULT JSONExtractString(message,'type'),

    `meshName` String DEFAULT JSONExtractString(message,
'meshName'),

    `clusterName` String DEFAULT JSONExtractString(message,
'clusterName'),

    `timestamp` DateTime DEFAULT now(),

    `message` String,

    `userAgent` String DEFAULT JSONExtractString(req.headers,
 'user-agent')
)
ENGINE = MergeTree
PARTITION BY (toYYYYMM(toDateTime(reqTime / 1000)))
ORDER BY (reqTime)
SETTINGS index_granularity = 8192
