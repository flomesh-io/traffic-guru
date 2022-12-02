((
  { config } = pipy.solve('config.js')
) =>

  pipy({
    _upstream: undefined,
    _target: undefined,

    _counter: undefined,
    _exists: undefined,

    _failures: {},
    _healthy: {},

    _targetHealthcheckCounter: new stats.Counter('pipy_4lb_healthcheck', ['target', 'serviceId']),

    _check: e => (
      (e.error === 'ConnectionRefused' ? (
        _failures[_target] = (_failures[_target]|0) + 1,
        _targetHealthcheckCounter.withLabels(_target, config.loadBalancers[_upstream].serviceId).zero()
      ) : (
        _failures[_target] = 0,
        _targetHealthcheckCounter.withLabels(_target, config.loadBalancers[_upstream].serviceId).increase()
      )
    )),

    _router: new algo.URLRouter({
      '/unhealthy': () => (
        new Message(
          {
            headers: {
              'content-type': 'application/json'
            },
          },
          JSON.encode(
            Object.entries(_failures).filter(
              ([k, v]) => v >= config.healthcheck.failures && !_healthy[k]
            ).map(e => e[0])
          )
        )
      ),
      '/healthy': msg => (
        msg.head.method === 'GET' && (
          new Message(
            JSON.encode(Object.keys(_healthy))
          )
        ) ||
        msg.head.method === 'POST' && (
          _healthy[msg.body.toString()] = true
        ) ||
        msg.head.method === 'DELETE' && (
          delete _healthy[msg.body.toString()]
        ) || (
          new Message({ status: 405 })
        )
      ),
      '/*': () => new Message({ status: 404 }),
    })
  })

  .task(config.healthcheck.interval)
    .onStart(() => new Message)
    .handleStreamStart(
      () => (
        _exists = new Set(),
        _counter = { upstream_count: 0 }
      )
    )
    .fork('per-upstream',
      () => (Object.keys(config.loadBalancers).map(u => ({ _upstream: u }))))
    .replaceMessage(
      new StreamEnd
    )
    .wait(
      () => _counter.upstream_count === 0
    )

  .pipeline('per-upstream')
    .onStart(obj => void(
      _upstream = obj["_upstream"],
      _counter.upstream_count++,
      _counter[_upstream] = 0
    ))
    .fork('per-node',
      () => (
        Object.keys(config.loadBalancers[_upstream].targets)
          .filter(t => !_exists.has(t))
          .map(t => (_exists.add(t), { _target: t }))
      )
    )
    .wait(
      () => _counter[_upstream] === 0
    )
    .replaceMessage(
      new StreamEnd
    )
    .handleStreamEnd(
      () => _counter.upstream_count--
    )

  .pipeline('per-node')
    .onStart(obj => void(
      _counter[_upstream]++,
      _target = obj["_target"]
    ))
    .connect(
      () => _target,
      {
        connectTimeout: config.healthcheck.interval,
        readTimeout: config.healthcheck.interval
      }
    )
    .handleStreamEnd(e => (
      _check(e),
      _counter[_upstream]--
    ))

  .listen(config.healthcheck.port)
    .serveHTTP(
      msg => _router.find(msg.head.path)(msg)
    )

  )()
