"use strict";
//////////////////////////////////////////////
var mysql = require('mysql');
var http = require('http');
var url = require('url');
var fs = require('fs');
//////////////////////////////////////////////
var nListenPort=8080;
var sMySqlHost = "localhost";
var sMySqlUser = "AlexBaS";
var sMySqlPassword = "Ten$12#More";
var sMySqlDatabase = "lesson1_db";
//////////////////////////////////////////////


// print process.argv to obtain Listen port value
process.argv.forEach(function (val, index, array) {
	var nPos=0;
	console.log(index + ': ' + val);
	nPos=val.search("ListenPort=");
	if(nPos>=0)
	{
		nListenPort = val.slice(nPos+11);
		console.log("Listen port: "+nListenPort);
	}

	nPos=val.search("MySqlHost=");
	if(nPos>=0)
	{
		sMySqlHost = val.slice(nPos+10);
		console.log("MySql Host: "+sMySqlHost);
	}

	nPos=val.search("MySqlUser=");
	if(nPos>=0)
	{
		sMySqlUser = val.slice(nPos+10);
		console.log("MySql User: "+sMySqlUser);
	}

	nPos=val.search("MySqlPassword=");
	if(nPos>=0)
	{
		sMySqlPassword = val.slice(nPos+14);
		console.log("MySql Password: "+sMySqlPassword);
	}

	nPos=val.search("MySqlDatabase=");
	if(nPos>=0)
	{
		sMySqlDatabase = val.slice(nPos+14);
		console.log("MySql Database: "+sMySqlDatabase);
	}
});

http.createServer(function (req, res)
{
	var bF1=true;
	var sP="";

	if(req.url.length>1)
	{
		var q = url.parse(req.url, true);
		var qdata = q.query;
		var qsearch = JSON.stringify(qdata);
		res.writeHead(200, {
			'Content-Type': 'text/html'
			,'Access-Control-Allow-Origin': '*'
			//, 'Cache-Control': 'no-cache'
		});

		console.log("Query pathname: "+q.pathname);
		console.log("Query search: "+qsearch);
		if((qdata.sql!=undefined)&&(qdata.sql.length>0))
		{
			console.log("sql="+qdata.sql);
			res.writeHead(200, {'Content-Type':'text/plain'});
			res.write("Response: ");
			//setTimeout(function(){DB_Query(qdata.sql, res);}, 100);
			DB_Query(qdata.sql, res);
			return;
		}
		//
		if(bF1)
		{
			sP = "."+q.pathname;
			bF1 = false;
			bF1 = ReadTextFile(sP, res);
		}
	}
	else
	{
		res.write("<html>");
		res.write("<head>");
		res.write("</head>");
		res.write("<body>");
		console.log("No URL found");
		res.write("<p style='color:red;'>Hello, there is no URL found</p>");
		res.write("</body>");
		res.write("</html>");
	}

	console.log("--Waiting for bF1--");
	if(!bF1)
	{
		/**/
		setTimeout(function(){res.end();
			console.log("--End of 'res'-1-");}, 100);
		/*
		res.end();
		console.log("--End of 'res'-2-");
		*/
		}
	else
	{
		res.end();
		console.log("--End of 'res'-2-");
	}
	//
}).listen(nListenPort);

function ReadTextFile(sPath, res)
{
	var b=false;

	fs.readFile(sPath, function(err, data) {
		if (err)
		{
			console.log("<p>--Failed to read file '"+sPath+"'--</p>");
		}
		else
		{
			res.write(data);
		}
		b = true;
		//bF1 = true;
	});

	console.log("--End of 'ReadTextFile'--");
	return b;
}

/////////////////////////////////////
var con = mysql.createConnection({
	host: sMySqlHost
	, user: sMySqlUser
	, password: sMySqlPassword
	, database: sMySqlDatabase
  });
  //
  con.connect(function(err) {
	if (err) 
	{
		console.log('Error '+err.code+': connecting to DB failed!');
		//
		if(err.sqlMessage!=undefined)
		{
			console.log(err.sqlMessage);
		}
		return;
	};
	console.log("Database 'lesson1_db':");
	console.log("Connection established.");
  });

  con.on('error', function(err){
	console.log("Unable to connect!");
  })
  //

function DB_Query(sql, res)
{
	var sQueryRes="";

	con.query(sql, function(err, result){
		if(err)
		{
			console.log(err);
			res.end();
		}
		else
		{
			sQueryRes = JSON.stringify(result);
			console.log(sQueryRes);

			res.write(sQueryRes);
			res.end();
			
			console.log("--End of query--");
		}
	});
}


