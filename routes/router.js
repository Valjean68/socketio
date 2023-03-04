const express=require('express')
const router=express.Router()

const path=require('path');

const jwt=require('jsonwebtoken')

const conexion=require('../database/db')
const {promisify}=require('util')


router.get('/login',(req,res)=>{res.render('login')})

router.get('/register',(req,res)=>{res.render('register')})

router.get('/oper',async(req,res,next)=>{
	if(req.cookies.jwt){
		try{
			const decodificada=await promisify(jwt.verify)(req.cookies.jwt,'tuvieja')
			conexion.query('select * from users where id = ?',[decodificada.id],(error,results)=>{
				if(!results){return next()}
				req.user=results[0]
				rol=results[0].rol

				return next()
			})
		}catch(error){
			return next()
		}
	}else{
		res.redirect('/login')
	}
},(req,res,next)=>{
	conexion.query('select * from public',(error,results)=>{
		if(error){
			throw error;
		}else{
			resultss=results

			return next()
		}

	});
},(req,res,next)=>{
	conexion.query('select * from private where idusuario=?',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
			resultspriv=results


			return next()
		}

	});
},(req,res)=>{res.render('oper',{user:req.user,results:resultss,respriv:resultspriv})})





router.get('/',async(req,res,next)=>{
	if(req.cookies.jwt){
		try{
			const decodificada=await promisify(jwt.verify)(req.cookies.jwt,'tuvieja')
			conexion.query('select * from users where id = ?',[decodificada.id],(error,results)=>{
				if(!results){return next()}
				req.user=results[0]
				rol=results[0].rol
				id=results[0].id


				return next()
			})
		}catch(error){
			return next()
		}
	}else{
		res.redirect('/login')
	}
},(req,res,next)=>{
	conexion.query('select * from public',(error,results)=>{
		if(error){
			throw error;
		}else{
			resultss=results

			return next()
		}

	});
},(req,res,next)=>{
	conexion.query('select * from private where idusuario=?',[id],(error,results)=>{
		if(error){
			throw error;
		}else{
			resultspriv=results


			return next()
		}

	});
},
(req,res)=>{

	if(rol=='admin'){


	res.render('index',{user:req.user,results:resultss,respriv:resultspriv})
	}else{
		res.redirect('/oper')
	}

})




router.get('/logout',(req,res)=>{
	res.clearCookie('jwt')
	return res.redirect('/')
})



router.post('/register',(req,res)=>{
	try{
	const name=req.body.name
	const user=req.body.user
	const pass=req.body.pass
	

	conexion.query('INSERT INTO users SET ?',{user:user,name:name,pass:pass},(error,results)=>{
		if(error){console.log(error)
		}else{
			res.redirect('/')
		}
	})

	}catch(error){
		console.log(error)
	}
})


router.post('/login',(req,res)=>{
	try{
		const user=req.body.user
		const pass=req.body.pass

		if(!user||!pass){
			res.redirect('register')
		}else{
			conexion.query('select * from users where user = ? and pass = ?',[user,pass],(error,results)=>{
				if(!results){
					res.redirect('register')
				}else{


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
					res.redirect('/')







				}
			})
		}
	}catch(error){
		console.log(error)
	}
})



module.exports=router