((
  config = JSON.decode(pipy.load('config.json')),
) => pipy({
  _certificates: Object.fromEntries(
    Object.entries(config.certificates).map(
      ([k, v]) => [
        k, {
          cert: new crypto.CertificateChain(os.readFile(v.cert)),
          key: new crypto.PrivateKey(os.readFile(v.key)),
        }
      ]
    )
  ),

})

  .export('main', {
    __route: undefined,
    __isTLS: false,
  })

  .listen(config.listen)
  .link('inbound-http')

  .listen(config.listenTLS || 0 )
  .onStart(() => void (__isTLS = true))
  .acceptTLS({
    certificate: {
      cert: new crypto.CertificateChain(os.readFile("../scerets/tls.crt")),
      key: new crypto.PrivateKey(os.readFile("../scerets/tls.key"))
    }
  }).to('inbound-http')

  .pipeline('inbound-http')
  .demuxHTTP().to(
    $ => $.chain(config.plugins)
  )

)()
