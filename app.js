const express=require('express')
const path=require('path');
const cookieParser=require('cookie-parser')

const app=express()


const jwt=require('jsonwebtoken')


const {promisify}=require('util')

const mysql=require('mysql');


const secure = require("ssl-express-www")


app.use(secure)



var pool  = mysql.createPool({
	host:'b0sgcwg4eug60jntides-mysql.services.clever-cloud.com',
	user:'udk8bvtgm70ockbw',
	password:'rzvZ3n60ga1LORXR4jct',
	database:'b0sgcwg4eug60jntides'

});
 







app.engine('html',require('ejs').renderFile)
app.set('view template','html')

app.set('view engine','ejs')



app.use(express.static(path.join(__dirname,'public')));

app.use(express.static(path.join(__dirname,'views')));

app.use(express.urlencoded({extended:true}))
app.use(express.json())



app.use(cookieParser())



app.use((req,res,next)=>{
	if(!req.user)
		res.header('Cache-Control','private,no-cache,no-store,must-revalidate');
		next();
});


app.set('port',process.env.PORT||3000);


const server=app.listen(app.get('port'));



const socketio=require('socket.io');

const io=socketio(server);
const users=[]
io.on('connection',(socket)=>{
	
	socket.on('user',(username)=>{

		const socketid=socket.id
		const usernamen=username
			var mundo=['🌎','🌍','🌐','🌏']
			var mund=Math.floor(Math.random()*3)
			var funciona=mundo[mund]

	const user={socketid,usernamen,funciona}
	users.push(user)
	io.sockets.emit('userlist',users)
	
	})


	socket.on('spy',(data)=>{
		console.log(data)
		socket.broadcast.to(data).emit('signal')
	})

	console.log('new connection',users);



	pool.getConnection(function(err, connection) {
  
  	connection.query('SELECT * FROM mensajes', (error,result)=>{
  		socket.emit('archivo',result)
  		console.log('queryendo')
  		connection.release();
  	});
	});





	io.sockets.emit('mapita');

	socket.emit('connectionyo');

	socket.on('chat:mensaje',(data)=>{

		io.sockets.emit('chat:mensaje',data);
		let inputq= data.mensaje;
		let inputn= inputq.replace(/'/g,"''");
		let nnq=data.usuario;
		let nnn=nnq.replace(/'/g,"''");
		
	

	pool.getConnection(function(err, connection) {
  
  connection.query("INSERT INTO mensajes (timestamp,usuario,mensaje) VALUES ('"+data.fecha+"','"+nnn+"','"+inputn+"')", (error,result)=>{connection.release();console.log('exito diria el de open inglish')});
});

	});

	socket.on('geoloc',(data)=>{

		setTimeout(function(){
    io.sockets.emit('geoloc',data)
}, 1000);
		
	})

	socket.on('disconnect',()=>{
		
		chau()
		io.sockets.emit('userlist',users)

		
		function chau(){const index=users.findIndex(user=>user.socketid===socket.id)
		if(index !==-1){return users.splice(index,1)[0]}
		}
		
		
		console.log('desconnection')

	})

});


app.get('/login',(req,res)=>{res.render('login')})

app.get('/register',(req,res)=>{res.render('register')})

app.get('/oper',async(req,res,next)=>{
	if(req.cookies.jwt){
		try{
			const decodificada=await promisify(jwt.verify)(req.cookies.jwt,'tuvieja')
			pool.getConnection(function(err, connection) {

			connection.query('select * from users where id = ?',[decodificada.id],(error,results)=>{
				if(!results){connection.release();console.log('q facil es esto che')
				return next()}
				req.user=results[0]
				rol=results[0].rol

				connection.release();console.log('exit')

				return next()
			})})
		}catch(error){
			return next()
		}
	}else{
		res.redirect('/login')
	}
},(req,res,next)=>{




			

	pool.getConnection(function(err, connection) {
	connection.query('select max(cast(elemento as signed)) as mas from public',(error,results)=>{
		if(error){
			throw error;
		}else{maxx=results
			
			
    connection.query('select * from public order by cast(elemento as signed) desc',(error,result)=>{resultss=result}
);

			connection.release();console.log('public de joseph. faltan 19')

			return next()
		}

	})});
},(req,res,next)=>{
	pool.getConnection(function(err, connection) {
	connection.query('select * from private where idusuario=?',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
			resultspriv=results

			
connection.release();console.log('agarro de private')


			return next()
		}

	})});
},(req,res)=>{res.render('oper',{user:req.user,maxx:maxx,results:resultss,respriv:resultspriv})
})





app.get('/',async(req,res,next)=>{
	if(req.cookies.jwt){
		try{
			const decodificada=await promisify(jwt.verify)(req.cookies.jwt,'tuvieja')
			pool.getConnection(function(err, connection) {
	connection.query('select * from users where id = ?',[decodificada.id],(error,results)=>{
				if(!results){connection.release();console.log('q facil es esto che')
				return next()}
				req.user=results[0]
				rol=results[0].rol
				id=results[0].id
console.log(results)
				connection.release();console.log('entra joseph o jiri ,aca creo q joseph. boe tambien entro jiri')


				return next()
			})})
		}catch(error){
			res.redirect('/login')
		}
	}else{
		res.redirect('/login')
	}
},(req,res,next)=>{pool.getConnection(function(err, connection) {
	connection.query('select max(cast(elemento as signed)) as mas from public',(error,results)=>{
		if(error){
			throw error;
		}else{maxx=results
			
			
    connection.query('select * from public order by cast(elemento as signed) desc',(error,result)=>{resultss=result}
);

			connection.release();console.log('public de joseph. faltan 19')

			return next()
		}

	})});
},(req,res,next)=>{pool.getConnection(function(err, connection) {
	connection.query('select * from private where idusuario=?',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
			resultspriv=results


			connection.release();console.log('private de joseph')


			return next()
		}

	})});
},
(req,res)=>{

	if(rol=='admin'){
console.log(maxx)

	res.render('index',{user:req.user,maxx:maxx,results:resultss,respriv:resultspriv})
	}else{
		res.redirect('/oper')
	}

})


app.get('/geol',async(req,res,next)=>{
	if(req.cookies.jwt){
		try{
			const decodificada=await promisify(jwt.verify)(req.cookies.jwt,'tuvieja')
			pool.getConnection(function(err, connection) {
			connection.query('select * from users where id = ?',[decodificada.id],(error,results)=>{
				if(!results){connection.release();console.log('q facil es esto che')
				return next()}
				req.user=results[0]
				rol=results[0].rol
				id=results[0].id
connection.release();console.log('ojala banque aca')

				return next()
			})})
		}catch(error){
			return next()
		}
	}else{
		res.redirect('/login')
	}
}
,(req,res)=>{
	if(rol=='admin'){
	res.render(path.join(__dirname+'/public/geol'))
	}else{
		res.redirect('/oper')
	}
})


app.get('/logout',(req,res)=>{
	res.clearCookie('jwt')
	return res.redirect('/')
})

app.get('/create',async(req,res,next)=>{
	if(req.cookies.jwt){
		try{
			const decodificada=await promisify(jwt.verify)(req.cookies.jwt,'tuvieja')
			pool.getConnection(function(err, connection) {
			connection.query('select * from users where id = ?',[decodificada.id],(error,results)=>{
				if(!results){connection.release();console.log('q facil es esto che')
				return next()}
				req.user=results[0]
				rol=results[0].rol
				id=results[0].id
connection.release();console.log('ya voy bacan')

				return next()
			})})
		}catch(error){
			return next()
		}
	}else{
		res.redirect('/login')
	}
}
,(req,res)=>{if(rol=='admin'){
	res.render('create')}else{
		res.redirect('/oper')
	}

})

app.get('/createp/:id',(req,res)=>{
	const id=req.params.id
	res.render('createp',{id:id})
})


app.post('/register',(req,res)=>{
	try{
	const name=req.body.name
	const user=req.body.user
	const pass=req.body.pass
	const rol=req.body.rol
	
pool.getConnection(function(err, connection) {
	connection.query('INSERT INTO users SET ?',{user:user,name:name,pass:pass,rol:rol},(error,results)=>{
		if(error){console.log(error)
		}else{
			connection.release();console.log('dice register no se q onda')
			res.redirect('/')
		}
	})})

	}catch(error){
		console.log(error)
	}
})


app.post('/login',(req,res)=>{
	try{
		const user=req.body.user
		const pass=req.body.pass

		if(!user||!pass){
			res.redirect('register')
		}else{pool.getConnection(function(err, connection) {
			connection.query('select * from users where user = ? and pass = ?',[user,pass],(error,results)=>{
				if(!results[0]){
					console.log(results)
					connection.release();console.log('q facil es esto che')
					res.redirect('register')
				}else{console.log(results)


					// BONSOIR aca aparece el JWT



					
					const id=results[0].id
					const token=jwt.sign({id:id},'tuvieja',{
						expiresIn: '7d'
					})

					const cookiesOptions={
						expires:new Date(Date.now()+90*24*60*60*1000),
						httpOnly: true

					}


					res.cookie('jwt',token,cookiesOptions)
					connection.release();console.log('q facil es esto che')
					res.redirect('/')







				}
			})})
		}
	}catch(error){
		console.log(error)
	}
})

app.get('/edit/:id',async(req,res,next)=>{
	if(req.cookies.jwt){
		try{
			const decodificada=await promisify(jwt.verify)(req.cookies.jwt,'tuvieja')
			

			pool.getConnection(function(err, connection) {connection.query('select * from users where id = ?',[decodificada.id],(error,results)=>{
				if(!results){connection.release();console.log('q facil es esto che')
				return next()}
				req.user=results[0]
				rol=results[0].rol
				id=results[0].id
connection.release();console.log('firme como esta')

				return next()
			})})
		}catch(error){
			return next()
		}
	}else{
		res.redirect('/login')
	}
},(req,res)=>{if(rol=='admin'){

	const id=req.params.id;
	pool.getConnection(function(err, connection) {
	connection.query('select * from public where id=?',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
			connection.release();console.log('y no se cae eh')
			res.render('edit',{elemento:results[0]});
		}
	})})
	}else{
		res.redirect('/oper')
	}

})

app.get('/editp/:id',(req,res)=>{

	const id=req.params.id;
		pool.getConnection(function(err, connection) {
	connection.query('select * from private where idpriv=?',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
connection.release();console.log('elemento priv papaso')
			res.render('editp',{elemento:results[0]});
		}
	})})
})

app.post('/update',(req,res)=>{
	const id=req.body.id;
	const item=req.body.item
	const user=req.body.user;
	pool.getConnection(function(err, connection) {
	connection.query('update public set ? where id=?',[{item:item,elemento:user},id],(error,result)=>{
		if(error){
			console.log(error)
		}else{connection.release();console.log('elemento cambiado señorrr')
			res.redirect('/')
		}
	})})
})

app.post('/updatep',(req,res)=>{
	const id=req.body.id;
	const user=req.body.user;
	pool.getConnection(function(err, connection) {
	connection.query('update private set ? where idpriv=?',[{elementopriv:user},id],(error,result)=>{
		if(error){
			console.log(error)
		}else{
			connection.release();console.log('elemento cambiado exitosamente señor exitoso')
			res.redirect('/')
		}
	})})
})


app.post('/save',(req,res)=>{
	const item=req.body.item
	const user=req.body.user;
	pool.getConnection(function(err, connection) {
	connection.query('insert into public set ?',{item:item,elemento:user},(error,results)=>{
		if(error){
			console.log(error)
		}else{connection.release();console.log('insert coin')
			res.redirect('/')
		}
	})})
}
)

app.post('/savep',(req,res)=>{
	
	const id=req.body.id
	const user=req.body.user;
	pool.getConnection(function(err, connection) {
	connection.query('insert into private set ?',{elementopriv:user,idusuario:id},(error,results)=>{
		if(error){
			console.log(error)
		}else{connection.release();console.log('aca no dormi')
			res.redirect('/')
		}
	})})
}
)


app.get('/delete/:id',async(req,res,next)=>{
	if(req.cookies.jwt){
		try{
			const decodificada=await promisify(jwt.verify)(req.cookies.jwt,'tuvieja')
			pool.getConnection(function(err, connection) {
			connection.query('select * from users where id = ?',[decodificada.id],(error,results)=>{
				if(!results){connection.release();console.log('q facil es esto che')
					return next()}
				req.user=results[0]
				rol=results[0].rol
				id=results[0].id
connection.release();console.log('provandou')

				return next()
			})})
		}catch(error){
			return next()
		}
	}else{
		res.redirect('/login')
	}
},(req,res)=>{if(rol=='admin'){
	const id=req.params.id;
	pool.getConnection(function(err, connection) {
	connection.query('delete from public where id=?',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
			connection.release();console.log('aca borro el publicou')
			res.redirect('/');
		}
	})})}else{
		res.redirect('/oper')
	}


})


app.get('/deletep/:id',(req,res)=>{
	const id=req.params.id;
	pool.getConnection(function(err, connection) {
	connection.query('delete from private where idpriv=?',[id],(error,results)=>{
		if(error){
			throw error;
		}else{connection.release();console.log('delete privete. fue un viaje eh')
			res.redirect('/');
		}
	})})
})




app.get('/chat/:id',(req,res)=>{
	if(req.cookies.jwt){
	const id=req.params.id
	res.render(path.join(__dirname+'/public/chat/index.ejs'),{id:id},null,(err,html)=>{
		res.send(html)
	})
	}else{
		res.redirect('/login')
	}
})
