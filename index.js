var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/health', function(request, response) {
  response.json({ status: 'healthy' })
})

app.get('/version', function(request, response) {
  response.json({ version: process.env.GIT_COMMIT || 'dev' })
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
