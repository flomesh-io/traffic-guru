((
  config = pipy.solve('config/transform.json'),
  services = config.services
) => pipy({
  _service: null,
  _head: null,
  _data: {},

  _obj2xml: node => (
    typeof node === 'object' ? (
      Object.entries(node).flatMap(
        ([k, v]) => (
          v?.val ? (
            v.val instanceof Array && (
              v.val.map(e => new XML.Node(k, v.attr, _obj2xml(e)))
            ) ||
            v.val instanceof Object && (
              new XML.Node(k, v?.attr, _obj2xml(v.val))
            ) || (
              new XML.Node(k, v?.attr, [v.val])
            )
          ) : (
            v instanceof Array && (
              v.map(e => new XML.Node(k, null, _obj2xml(e)))
            ) ||
            v instanceof Object && (
              new XML.Node(k, null, _obj2xml(v))
            ) || (
              new XML.Node(k, null, [v])
            )
          )

        )
      )
    ) : [
      new XML.Node('body', node.attr, [''])
    ]
  ),

  _xml2obj: node => (
    node ? (
      ((
        children,
        previous,
        obj, k, v,
      ) => (
        obj = {},
        node.children.forEach(node => (
          (children = node.children) && (
            k = node.name,
            v = children.every(i => typeof i === 'string') ? children.join('') : _xml2obj(node),
            previous = obj[k],
            previous instanceof Array ? (
              previous.push(v)
            ) : (
              obj[k] = previous ? [previous, v] : v
            )
          )
        )),
        obj
      ))()
    ) : {}
  ),
})

  .import({
    __route: 'main',
    __apiID: 'main'
  })

  .pipeline()
  .handleMessageStart(
    () => (
      _service = services[__apiID]
    )
  )
  .branch(
    () => _service?.enabled && _service?.type.toLowerCase() === 'json2xml', (
    $ => $
      .handleMessageStart(
        msg => (
          msg.head.headers['content-type'] = 'application/xml'
        )
      )
      .replaceMessage(
        msg => (
          (
            new Message(
              msg.head,
              XML.encode(
                new XML.Node(
                  '', null, [
                  new XML.Node(
                    'root', null,
                    _obj2xml(JSON.decode(msg.body))
                  )
                ]
                ),
                2,
              )
            )
          )
        )
      )
  ),
    () => _service?.enabled && _service?.type.toLowerCase() === 'xml2json', (
    $ => $
      .handleMessageStart(
        msg => (
          msg.head.headers['Content-Type'] = 'application/json'
        )
      )
      .replaceMessageBody(
        data => (
          JSON.encode(
            _xml2obj(XML.decode(data))
          )
        )
      )
  ),
    $ => $.chain()
  )
)()