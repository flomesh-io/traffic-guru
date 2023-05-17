CREATE TABLE bgpLog
(

    `timestamp` UInt64 DEFAULT JSONExtractInt(message,
 'timestamp'),

    `clusterName` String DEFAULT JSONExtractString(message,
 'clusterName'),

    `direction` String DEFAULT JSONExtractString(message,
 'direction'),

    `payload` String DEFAULT JSONExtractRaw(message,
 'payload'),

    `type` String DEFAULT JSONExtractString(payload,
 'type'),

    `body` String DEFAULT JSONExtractRaw(payload,
 'body'),

    `errorCode` String DEFAULT JSONExtractString(body,
 'errorCode'),

    `serviceId` UInt64 DEFAULT JSONExtractInt(message,
 'serviceId'),

    `message` String,

)
ENGINE = MergeTree
PARTITION BY (toYYYYMM(toDateTime(timestamp / 1000)))
ORDER BY (timestamp)
SETTINGS index_granularity = 8192
