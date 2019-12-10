const http = require('http')

const port = 3000

const requestHandler = (request, response) => {
  response.end('OK')
}

const server = http.createServer(requestHandler)

server.listen(port, err => {
  if (err) {
    return console.error('something bad happened', err)
  }

  console.info(`server is listening on ${port}`)
})
