var http = require("http");
var port = 8686;

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

const serialize = {
    'application/json': JSON.stringify,
    'application/xml': (response) => {
        const indentationSpaces = 2
        const header = '<?xml version="1.0" encoding="UTF-8"?>\n<response>\n'
        let responseBody = ''
        const footer = '</response>'

        for (const property in response) {
            responseBody += 
            ' '.repeat(indentationSpaces) +
            `<${property}>${response[property]}</${property}>` +
            '\n'
        }

        return header + responseBody + footer
    }
}

function toFahrenheit(temperature) {
  return (temperature * 9 / 5) + 32;
}

http.createServer(function(req,res){
  console.log('New incoming client request for ' + req.url);
  let response;
  const [path, paramsString] = req.url.split('?')
  const params = new URLSearchParams(paramsString);

  switch(path) {
    case '/temperature':
      const temperatureInCelsius = randomInt(1, 40)
    
      if (params.get('unit') === 'F') {
        response = {
            temperature: toFahrenheit(temperatureInCelsius),
            unit: "F"
        }
      } else {
        response = {
            temperature: temperatureInCelsius,
            unit: "C"
        }
      }
    break;
    case '/light':
      response = {
        light: randomInt(1, 100)
      }
      break;
    default:
      response = {
        hello: "world"
      }
  }

  const returnFormat = req.headers.accept?.includes('application/xml') ? 'application/xml' : 'application/json'
  res.writeHeader(200, {'Content-Type': returnFormat});
  res.write(serialize[returnFormat](response));
  res.end();
}).listen(port);
console.log('Server listening on http://localhost:' + port);
