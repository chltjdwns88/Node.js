var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib_template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');



var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log()
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('../week_46_security', function(error, filelist){
          var list = template.list(filelist);
          var title = 'welcome';
          var description = "hello Node.js";
          var html = template.html(title, list, `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
          response.writeHead(200);  //성공코드
          response.end(html);
        });
      } else {
        fs.readdir('../week_46_security', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`${filteredId}`, 'utf8', function(err, data){
            var title = queryData.id;
            var sanitized_Title = sanitizeHtml(title);
            var sanitized_data = sanitizeHtml(data, {
              allowedTags: ['h1']
            });
            var list = template.list(filelist);
            var html = template.html(title, list, `<h2>${sanitized_Title}</h2>${sanitized_data}`,
            `
            <a href="/create">create</a>
            <a href="/update?id=${sanitized_Title}">update</a>
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitized_data}">
              <input type="submit" value="delete">
            </form>
            `
            );
            response.writeHead(200);  //성공코드
            response.end(html);
            });
        });
      }
    } else if (pathname === '/create'){
        fs.readdir('../week_46_security', function(error, filelist){
          var list = template.list(filelist);
          var title = 'WEB-CREATE';
          var html = template.html(title, list, `
            <form action="/create_process" method='post'>
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="des"></textarea>
              </p>
              <p><input type="submit"></p>
            </form>
            `, '');
          response.writeHead(200);  //성공코드
          response.end(html);
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
      fs.readdir('../week_46_security', function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`${filteredId}`, 'utf8', function(err, data){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.html(title, list,
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
          response.end(html);
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
          fs.writeFile(`./${title}`, des, 'utf8', function(err){
            response.writeHead(302, {Location:`/?id=${title}`}); // 302 는 redirection
            response.end();
        })
        });
      });
    } else if (pathname === '/delete_process'){
      var body = ``;
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`./${filteredId}`, function(err){         // 파일삭제
          response.writeHead(302, {Location: `/`});
          response.end();
        });
      });
    } else {
      response.writeHead(404); //에러코드
      response.end("Not found");
    }
});
app.listen(3000);
