const TESTCASE = `pipy({
  _upstream_router: new algo.URLRouter({
    '/1': new Data(new Array(1024).fill(65)),
    '/10': new Data(new Array(10*1024).fill(65)),
    '/100': new Data(new Array(100*1024).fill(65)),
    '/1000': new Data(new Array(1000*1024).fill(65)),
    '/*': new Data(new Array(128).fill(65))
  }),

  // proxies
  _upstream_services: (
    Object.fromEntries(
      Object.entries({
        "default": [
          "127.0.0.1:8080",
        ]
      }).map(
        ([k, v]) => [
          k, new algo.RoundRobinLoadBalancer(v)
        ]
      )
    )
  ),

  _proxy_router: new algo.URLRouter({
      '/*': "default"
    }),

  __turnDown: false,
  __serviceID: '',

  _balancer: null,
  _balancerCache: null,
  _target: '',
  _targetCache: null,

  _g: {
    connectionID: 0,
  },

  _connectionPool: new algo.ResourcePool(
    () => ++_g.connectionID
  )
})

.listen(8080)
  .serveHTTP(
    req => new Message(
      _upstream_router.find(req.head.path)
    )
  )

.listen(8000)
  .handleStreamStart(
    () => (
      _balancerCache = new algo.Cache(
        // k is a balancer, v is a target
        (k  ) => k.select(),
        (k,v) => k.deselect(v),
      ),
      _targetCache = new algo.Cache(
        // k is a target, v is a connection ID
        (k  ) => _connectionPool.allocate(k),
        (k,v) => _connectionPool.free(v),
      )
    )
  )
  .handleStreamEnd(
    () => (
      _targetCache.clear(),
      _balancerCache.clear()
    )
  )
  .demuxHTTP('router-request')

.pipeline('router-request')
  .handleMessageStart(
    msg => (
      __serviceID = _proxy_router.find(
        msg.head.headers.host,
        msg.head.path,
      )
    )
  )
  .link(
    'balancer-request'
  )

.pipeline('balancer-request')
  .handleMessageStart(
    () => (
      _balancer = _upstream_services[__serviceID],
      _balancer && (_target = _balancerCache.get(_balancer)),
      _target && (__turnDown = true)
    )
  )
  .link(
    'balancer-forward', () => Boolean(_target),
    ''
  )

.pipeline('balancer-forward')
  .muxHTTP(
    'balancer-connection',
    () => _targetCache.get(_target)
  )

.pipeline('balancer-connection')
  .connect(
    () => _target
  )

.pipeline('404-request')
  .replaceMessage(
    new Message({ status: 404 }, 'No handler')
  )
`;
export { TESTCASE };
