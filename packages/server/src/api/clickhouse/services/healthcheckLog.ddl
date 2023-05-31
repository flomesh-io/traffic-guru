CREATE TABLE healthcheckLog
(

    `timestamp` UInt64 DEFAULT JSONExtractInt(message,
 'timestamp'),

    `upstream` String DEFAULT JSONExtractString(message,
 'upstream'),

    `target` String DEFAULT JSONExtractString(message,
 'target'),

    `state` String DEFAULT JSONExtractString(message,
 'state'),

    `serviceId` UInt64 DEFAULT JSONExtractInt(message,
 'serviceId'),

    `serviceName` String DEFAULT JSONExtractString(message,
 'serviceName'),

    `message` String,

)
ENGINE = MergeTree
PARTITION BY (toYYYYMM(toDateTime(timestamp / 1000)))
ORDER BY (timestamp)
SETTINGS index_granularity = 8192
