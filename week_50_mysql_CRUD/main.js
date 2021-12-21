var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib_template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'opentutorials'
});

connection.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log()
    if(pathname === '/'){
      if(queryData.id === undefined){
        connection.query(`SELECT * FROM topic`, function(err, results){
            var description = "hello, node.js";
            var title = 'Welcome';
            var list = template.list(results);
            var html = template.html(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        });
      } else {
        connection.query(`SELECT * FROM topic`, function(err, results){
            if(err) throw err;
            connection.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(err2, results){
              if(err2) throw err2;
              var description = results[0].description;
              var title = results[0].title;
              var list = template.list(results);
              var html = template.html(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>
               <a href="/update?id=${queryData.id}">update</a>
                <form action="/delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>
              `);
              response.writeHead(200);
              response.end(html);
            });

        });

      }
    } else if (pathname === '/create'){
        connection.query(`SELECT * FROM topic`, function(err, results){
            var title = 'Create';
            var list = template.list(results);
            var html = template.html(title, list,
            `
              <form action="/create_process" method='post'>
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="des"></textarea>
                </p>
                <p><input type="submit"></p>
              </form>
            `,
            `<a href="/create">create</a>`);
            response.writeHead(200);
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

        connection.query(`INSERT INTO topic (title, description, created, author) VALUES(?, ?, NOW(), ?)`,
         [post.title, post.description, 1], function(err, results){
            if(err) throw err;
            response.writeHead(302, {Location: `/?id=${results.insertId}`}) //최근 insert id로 redirect
        });
      });
    } else if (pathname === '/update'){
      connection.query(`SELECT * FROM topic`, function(err, result){
        if(err) throw err;
        connection.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(err2, result2){
          if(err2) throw err2;
          var list = template.list(result);
          var html = template.html(result2[0].title, list,
            `
            <form action="/update_process" method='post'>
              <input type="hidden" name="id" value="${result2[0].id}" >
              <p><input type="text" name="title" placeholder="title" value=${result2[0].title}></p>
              <p>
                <textarea name="description" placeholder="des">${result2[0].description}</textarea>
              </p>
              <p><input type="submit"></p>
            </form>
            `,
            `
            <a href="/create">create</a>
            <a href="/update?id=${result2[0].id}">update</a>
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
        connection.query(`UPDATE topic SET title=?, description=?, author=1 WHERE id=?`, [post.title, post.description, post.id], function(err, results){
          if(err) throw err;
          response.writeHead(302, {Location:`/?id=${post.id}`});
          response.end();
        })
      });
    } else if (pathname === '/delete_process'){
      var body = ``;
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        connection.query(`DELETE FROM topic WHERE id=?`, [post.id], function(err, result){
          if(err) throw err;
          response.writeHead(302, {Location:`/`});
          response.end();
        });
      });
    } else {
      response.writeHead(404); //에러코드
      response.end("Not found");
    }
});
app.listen(3000);
