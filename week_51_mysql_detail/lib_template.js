module.exports = {
  html:function(title, list, body, control){
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
  },
  list:function (filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list += `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`;
      i++;
    }
    list = list+'</ul>';
    return list;
  },
  authorSelect:function(authors, authors_id){
    var tag = ``;
    var i = 0;
    while(i < authors.length){
      var selected = '';
      if(authors_id == authors[i].id){
         seleted = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`
      i++;
    }
    return `
    <select name="author">
      ${tag}
    </select>
    `
  }
}
