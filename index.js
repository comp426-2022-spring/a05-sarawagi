// Place your server entry point code here
const express = require('express')
const app = express()
const args = require("minimist")(process.argv.slice(2))
const db = require("./src/services/database.js")
const fs = require('fs')
const morgan = require('morgan')
//Command Line Argument for port here
args["port"]
args["help"]
args["log"]
args["debug"]
args["h"]

const help = (`
server.js [options]
--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help	Return this message and exit.
`)

if (args.help || args.h) {
  console.log(help)
  process.exit(0)
}

const port = args.port || process.env.PORT || 5000
if (args.port < 1 || args.port > 65535){
  port = 5000
}
const server = app.listen(port, () => {
    console.log(`Server is and running on ${port}`)
    //Same asconsole.log('App is running on port %PORT%'.replace('$PORT$', port))
})

app.use(express.static('./public'))

if (args.log == 'false') {
    console.log("NOTICE: not creating file access.log")
} else {
    const logdir = './log/';

    if (!fs.existsSync(logdir)){
        fs.mkdirSync(logdir);
    }
    const accessLog = fs.createWriteStream( logdir+'access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: accessLog }))
}
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('./public'))
app.use((req, res, next) => {
  const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?,?,?,?,?,?,?,?,?,?)')
  const info = stmt.run(req.ip, req.user, Date.now(), req.method, req.url, req.protocol, req.httpVersion, res.statusCode, req.header['referer'], req.headers['user-agent'])
  
  next()
})

//coinflip functions can go here
function coinFlip() {
  //return (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
  return Math.random() > .5 ? ("heads") : ("tails")
  }
  
  
  function coinFlips(flips) {
    const result = []
    for(let i = 0; i < flips; i++){
      result[i] = coinFlip();
    }
  return result;
  }

  
  function countFlips(array) {
  let nt = 0;
  let nh = 0;
  let length = array.length;
  for(let i = 0; i < length; i++){
    if(array[i] == "heads"){
      nh++;
    }
    else if(array[i] == "tails"){
      nt++;
    }
  }
  return "{ tails: "+ nt +", heads: "+ nh + " }"
  }

  
  function flipACoin(call) {
  let flipresult = coinFlip();
  if(flipresult == call){
    return "{ call: '"+call+"', flip: '"+flipresult+"', result: 'win' }"
  }
  else if( flipresult != call){
    return "{ call: '"+call+"', flip: '"+flipresult+"', result: 'lose' }"
  }
  }

app.get('/app', (req, res) => {
    res.status(200).end('OK')
})

app.get('/app/log/access', (req, res) => {
  try {
    if (args.debug){
        const stmt = db.prepare('SELECT * FROM accessLog').all()
        res.status(200).json(stmt)
    } else {
        res.status(404).json("404 NOT FOUND")
    }
    
} catch (e){
    console.error(e)
}
})

app.get('/app/error', (req, res) => {
  if (args.debug){
    throw new Error('Error test successful.')
  } else {
    res.status(404).json("404 NOT FOUND")
  }
})

app.get('/app/flip', (req, res) => {
    var flip = coinFlip()
    res.status(200).json({'flip': flip})
    
})

app.get('/app/flips/', (req, res) => {
    var flips = coinFlips(1)
    var count = countFlips(flips)
    res.status(200).json( {'raw': flips, 'summary':count})
    
})

app.get('/app/flips/:number', (req, res) => {
    var flips = coinFlips(req.params.number)
    var count = countFlips(flips)
    res.status(200).json( {'raw': flips, 'summary':count})
})

app.get('/app/flip/call/:guess', (req, res) => {
    var result = flipACoin(req.params.guess)
    var flip = coinFlip()
    
    var result = flip == req.params.guess ? 'win':'lose'
    res.status(200).json({'call': req.params.guess, 'flip': flip, 'result':result })
    
    
    
})

app.use(function(req, res) {
    res.status(404).send("404 NOT FOUND")
    
}

)