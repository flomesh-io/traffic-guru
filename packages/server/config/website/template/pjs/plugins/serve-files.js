((
  config = pipy.solve('config.js'),

  sites = config['serve-files'],

  mimeTypes = config['mime'],

) => pipy({
  _file: null,
  _reqPathName: null
})

  .import({
    __route: 'main',
  })

  .pipeline()
  .handleMessageStart(
    msg => (
      ((
        root = sites[__route]?.root,
      ) => (
        _reqPathName = new URL(msg.head.path).pathname,
        root && (
          _file = http.File.from(root + _reqPathName),
         !_file && (_file = http.File.from(root.replace("..", "") + _reqPathName))
        )
      ))()
    )
  )
  .branch(
    () => Boolean(_file), (
    $ => $
      .replaceData()
      .replaceMessage(
        msg => _file.toMessage(msg.head.headers['accept-encoding'])
      )
      .handleMessageStart(
        (msg, ext) => (
          _reqPathName
            && _reqPathName.indexOf(".") > -1
            && (ext = _reqPathName.split(".")[_reqPathName.split(".").length - 1]),
          ext
          && mimeTypes[ext]
          && (msg.head.headers["content-type"] = mimeTypes[ext])
        )
      )
  ),
    $ => $.chain()
  )


)()
