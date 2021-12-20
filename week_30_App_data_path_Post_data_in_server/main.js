var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('../week_30_App_data_path_Post', function(error, filelist){
          var list = templateList(filelist);
          var title = 'welcome';
          var description = "hello Node.js";
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);  //성공코드
          response.end(template);
        });
      } else {
        fs.readdir('../week_30_App_data_path_Post', function(error, filelist){
          fs.readFile(`${queryData.id}`, 'utf8', function(err, data){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${data}`);
            response.writeHead(200);  //성공코드
            response.end(template);
            });
        });
      }
    } else if (pathname === '/create'){
        fs.readdir('../week_30_App_data_path_Post', function(error, filelist){
          var list = templateList(filelist);
          var title = 'WEB-CREATE';
          var template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method='post'>
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="des"></textarea>
              </p>
              <p><input type="submit"></p>
            </form>
            `);
          response.writeHead(200);  //성공코드
          response.end(template);
        });
    } else if(pathname === '/create_process'){
      var body = ``;
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var des = post.description;
        console.log(title);
        console.log(des);
      });
      response.writeHead(200);
      response.end("Success!");
    } else {
      response.writeHead(404); //에러코드
      response.end("Not found");
    }
});
app.listen(3000);
