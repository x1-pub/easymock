import http from 'http'
import httpProxy from 'http-proxy'
import url from 'url'
import chalk from 'chalk'

const isDev = process.env.NODE_ENV === 'development'

const proxy = httpProxy.createProxyServer({});
proxy.on('error', (err, req, res) => {
  res.writeHead(500)
  res.end(String(err));
});

const server = http.createServer(function (req, res) {
  const { pathname } = url.parse(req.url);

  if (!pathname || pathname.split('/').pop().includes('.')) {
    res.writeHead(404);
    res.end();
    return
  }

  const host = req.headers.host
  const projectId = isDev ? req.headers['project-id'] : host?.split('.easymock.x1.pub')?.[0]
  const isLegal = /^[0-9a-fA-F]{24}$/.test(String(projectId))

  if (!isLegal) {
    res.writeHead(404);
    res.end()
    return
  }

  proxy.web(req, res, {
    target: 'http://127.0.0.1:9907/user-http-proxy',
    headers: {
      'project-id': String(projectId),
    }
  });

  console.log(chalk.green(`[${new Date().toISOString()}] ${req.method} ${pathname}`))
});

server.listen(5050, () => {
  console.log('')
  console.log(
    chalk.green('  ➜  ') +
    'Local:  ' +
    chalk.hex('#8EFAFD').underline('http://127.0.0.1:5050')
  )
  console.log('')
});
