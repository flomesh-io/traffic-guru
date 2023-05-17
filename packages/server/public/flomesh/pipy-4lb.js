//
// Global functions
//

((
    configure,
    balancer,
    log,
) => (

console.log(JSON.stringify(os.env)),

// Loads configuration
configure = conf => (
    $global.upstream = conf,
    $global.upstream.balancer = balancer(conf)
),

// Balancer constructor
balancer = conf => (
    ((
        targets, weights, buckets,
        total, count,
        hash, min, cur, idx,
    ) => (
        targets = Object.entries(conf.targets),
        conf.mode === 'rr' && (
            weights = targets.map(t => t[1]),
            buckets = targets.map(() => 0),
            total = weights.reduce((a, b) => a + b),
            count = 0,            
            () => (
                min = Number.POSITIVE_INFINITY,
                targets.forEach((t, i) => (
                    (cur = buckets[i] / weights[i]),
                    (cur < min) && (
                        $target = t[0],
                        min = cur,
                        idx = i
                    )
                )),
                buckets[idx]++,
                (++count >= total) && (buckets.fill(0), count = 0)
            )
        ) ||
        conf.mode === 'lc' && (
            () => (
                min = Number.POSITIVE_INFINITY,
                targets.forEach(t => (
                    (cur = $connections[t[0]] | 0),
                    (cur < min) && (
                        $target = t[0],
                        min = cur
                    )
                ))
            )
        ) || (
            session => (
                hash = session.root.remoteAddress.split('.').reduce((h, x) => (h|0) + (x|0)),
                $target = targets[hash % targets.length][0]
            )
        )
    ))()
),

// Send log via a shared pipeline session
log = msg => (
    ((
        session,
    ) => (
        session = $global.loggingSession,
        (!session || session.done) && (
            session = new Session('log-send'),
            session.start(),
            $global.loggingSession = session
        ),
        session.input(new Message(JSON.encode(msg)))
    ))()
),

//
// Pipeline definitions
//

pipy({

    // Global configuration
    $global: {},
    $configUrl: new URL(os.env.PIPY_CONF_URL || 'http://127.0.0.1:6002/config'),
    $env: {},

    // Tracks upstream connections
    $connections: {},

    // Tracks sticky sessions
    $sticky: {},

    // Context states
    $upstream: null,
    $target: '',

    // Logging data
    $startTime: 0,
    $responseTime: 0,
    $ingressData: 0,
    $egressData: 0,
    $httpRequest: null,
    $httpRequestBody: null,
    $httpResponse: null,
    $httpResponseBody: null,
})

// L4 inbound
.listen((os.env.PIPY_PORT|0) || 6000)
    .onSessionStart(() => (
        $startTime = Date.now(),
        $upstream = $global.upstream,
        $upstream && (
            $upstream.sticky ? (
                ((key) => (
                    key = this.root.remoteAddress,
                    $target = $sticky[key],
                    $target || $upstream.balancer(this),
                    $sticky[key] = $target
                ))()
            ) : (
                $upstream.balancer(this)
            )
        ),
        $target && $connections[$target]++
    ))
    .onSessionEnd(() => (
        $target && $connections[$target]--,
        log({
            message: JSON.stringify({
                lbType: "4LB",
                lbId: os.env.LB_ID,
                pipyId: os.env.PIPY_ID,
                remoteAddress: this.root.remoteAddress,
                remotePort: this.root.remotePort,
                localAddress: this.root.localAddress,
                localPort: this.root.localPort,
                nodeIp: os.env.NODE_IP ? os.env.NODE_IP : '',
                vip: os.env.VIP ? os.env.VIP : '',
                startTime: $startTime,
                endTime: Date.now(),
                ingress: $ingressData,
                egress: $egressData,
            })
        })
    ))
    .tap(() => ($upstream?.bpsLimit ?? -1) + 'k')
    .link(() => $target === '' ? 'ban' : 'pass')

// pass
.pipeline('pass')
    .onData(evt => $ingressData += evt.size)
    .proxy(() => $target)
    .onData(evt => $egressData += evt.size)

// ban
.pipeline('ban')
    .replaceSessionStart(() => new SessionEnd)

// Send out the log
.pipeline('log-send')
    .encodeHttpRequest({
        method: 'POST',
        path: '/?query=insert%20into%20log%20format%20JSONEachRow',
        headers: {
            // 'X-ClickHouse-User': 'default',
            // 'X-ClickHouse-Key': 'password',
        },
    })
    .proxy('127.0.0.1:8123')

// Check configuration
.task('5s')
    .replaceSessionStart(() => [
        new SessionStart,
        new Message({
            method: 'GET',
            path: $configUrl.path + '/version',
            headers: {
                Host: $configUrl.host,
            },
        }),
    ])
    .encodeHttpRequest()
    .proxy(() => $configUrl.host)
    .decodeHttpResponse()
    .onMessage(msg => (
        msg.body.toString() == $global.version ? (
            this.exit()
        ) : (
            new Session('update-config').start()
        )
    ))

// Update configuration
.pipeline('update-config')
    .onSessionStart(() => console.log('Updating configuration...'))
    .replaceSessionStart(() => [
        new SessionStart,
        new Message({
            method: 'GET',
            path: $configUrl.path,
            headers: {
                Host: $configUrl.host,
            },
        }),
    ])
    .encodeHttpRequest()
    .proxy(() => $configUrl.host)
    .decodeHttpResponse()
    .onMessage(evt => (
        console.log('Received configuration:'),
        console.log(evt.body.toString()),
        this.root.exit(),
        configure(JSON.decode(evt.body)),
        $global.version = evt.head.headers.etag
    ))

))()
