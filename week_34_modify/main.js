var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
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
    ${control}
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
    console.log()
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('../week_34_modify', function(error, filelist){
          var list = templateList(filelist);
          var title = 'welcome';
          var description = "hello Node.js";
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
          response.writeHead(200);  //성공코드
          response.end(template);
        });
      } else {
        fs.readdir('../week_34_modify', function(error, filelist){
          fs.readFile(`${queryData.id}`, 'utf8', function(err, data){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${data}`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
            response.writeHead(200);  //성공코드
            response.end(template);
            });
        });
      }
    } else if (pathname === '/create'){
        fs.readdir('../week_34_modify', function(error, filelist){
          var list = templateList(filelist);
          var title = 'WEB-CREATE';
          var template = templateHTML(title, list, `
            <form action="/create_process" method='post'>
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="des"></textarea>
              </p>
              <p><input type="submit"></p>
            </form>
            `, '');
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
        fs.writeFile(`./${title}`, des, 'utf8', function(err){
          response.writeHead(302, {Location:`/?id=${title}`}); // 302 는 redirection
          response.end();
        });
      });
    } else if (pathname === '/update'){
      fs.readdir('../week_34_modify', function(error, filelist){
        fs.readFile(`${queryData.id}`, 'utf8', function(err, data){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list,
            `
            <form action="/update_process" method='post'>
              <input type="hidden" name="id" value="${title}" >
              <p><input type="text" name="title" placeholder="title" value=${title}></p>
              <p>
                <textarea name="description" placeholder="des">${data}</textarea>
              </p>
              <p><input type="submit"></p>
            </form>
            `,
            `
            <a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            `
          );
          response.writeHead(200);  //성공코드
          response.end(template);
          });
      });
    } else if (pathname === '/update_process'){
      var body = ``;
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var des = post.description;
        fs.rename(`./${id}`, `./${title}`, function(error){

        })
        console.log(post);
        fs.writeFile(`./${title}`, des, 'utf8', function(err){
          response.writeHead(302, {Location:`/?id=${title}`}); // 302 는 redirection
          response.end();
        });
      });
    } else {
      response.writeHead(404); //에러코드
      response.end("Not found");
    }
});
app.listen(3000);
