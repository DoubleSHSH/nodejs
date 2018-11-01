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
    <h1><p align="center"><a href="/">1-WEB page-</p></a></h1>
    ${list}
    <hr color='puple'>
    <a href="/create">create</a>
    <hr color='blue'>
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  var list = '<ul>';
  var i=0;
  while(i<filelist.length){
    //print(filelist.length);
    var k=0;
    var filelistname="";
    while(k<filelist[i].length){
      if(filelist[i][k]==='.'){
        break;
      }
      else{
        filelistname=filelistname+filelist[i][k];
        //console.log(filelistname);
      }
      k=k+1;
    }//while ( . ) end
    list=list+`<li><a href ="/?id=${filelistname}">${filelistname}</a></li>`;
    i+=1;
  }
  list =list+'</ul>';
  return list;
}

/*
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}
*/


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          //console.log(list);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);
        })
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}.txt`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            console.log(description);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.end(template);
          });
        });
      }
    }else if (pathname ==='/create'){
        fs.readdir('./data', function(error, filelist){
          var title = 'WEB -create';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `
           //수정 삭제 생성은 method =post 꼭설정 url 쿼리 안남김
<form action="http://220.149.189.234:3000/create_process" method="post">
<p><input type = "text" name="tiltle" placeholder="title"></p>
<p>
  <textarea  name="description"></textarea>
</p>
<p>
  <input type="submit" >
</p>
          `);
          response.writeHead(200);
          console.log(__dirname,'port :',app.address().port);
          response.end(template);
        })
      }
    else if (pathname ==='/create_process'){
      var body = '';
      request.on('data', function(data){
        body = body+data;
        //길어서 파괴한다.
        if(body.length >1e6) request.connection.destroy();
      });

      request.on('end', function(){
        var post =qs.parse(body);
      });
      response.writeHead(200);
      response.end('success');
    }

    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
