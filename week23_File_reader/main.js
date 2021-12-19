var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('../week23_File_reader', function(error, filelist){
          var list = `<ul>`;
          var i = 0;
          while(i < filelist.length){
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
          }
          list = list+'</ul>';
          var title = 'welcome';
          var description = "hello Node.js";
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
              ${list}
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);  //성공코드
          response.end(template);
        })
      } else {
        fs.readdir('../week23_File_reader', function(error, filelist){
          var list = `<ul>`;
          var i = 0;
          while(i < filelist.length){
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
          }
          list = list+'</ul>';
        fs.readFile(`${queryData.id}`, 'utf8', function(err, data){
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
              ${list}
            </ol>
            <h2>${title}</h2>
            <p>${data}</p>
          </body>
          </html>
          `;
          response.writeHead(200);  //성공코드
          response.end(template);
          });
        });
      }
    } else {
      response.writeHead(404); //에러코드
      response.end("Not found");
    }
});
app.listen(3000);
