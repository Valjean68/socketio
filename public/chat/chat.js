const socket=io()

//la historia del bardo de aca es la siguiente, bueno no parece tener tanta vuelta, define variables de los input del html
//despues las hace laburar de esta manera, parece clara dentro de todo
//el truco esta en el socket. enrealidad hay una o dos cosas q merecen la pena decir. los eventos toman los valores de los input, con el click al boton y con el presskey no se, y el tema del socket viene abajo
//socket primero es para crear el evento, y abajo en socket on lo extrae, llama al mismo evento a traves de socket on y el evento, y hace lo q le decis con lso datos q dispones para mostrar


let mensaje=document.getElementById('mensaje');
let usuario=document.getElementById('usuario');
let btn=document.getElementById('btn');
let output=document.getElementById('output');
let userlist=document.getElementById('userlist');
let user=document.getElementById('user')




socket.emit('user',user.value)

mensaje.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("btn").click();
  }
});


btn.addEventListener('click',function(){
	if(mensaje.value!=''){
		const fecha=new Date();
		let dia=fecha.getDate();
		let mes=fecha.getMonth()+1;
		let anno=fecha.getYear()+1900;
		let hora=fecha.getHours();
		let minutos=fecha.getMinutes();
		let eldia = dia+"/"+mes+"/"+anno+" "+hora+":"+minutos;
		
	socket.emit('chat:mensaje',{
		
		fecha:eldia,
		mensaje:mensaje.value,
		usuario:usuario.value
	});
}
});







socket.on('signal',()=>{
	navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
	navigator.geolocation.getCurrentPosition(poss)

		function poss(pos){
		const lat=pos.coords.latitude
		const lon=pos.coords.longitude
		socket.emit('geoloc',{
			lat:lat,
			lon:lon
		})
		output.innerHTML+='<p style="padding-left: 3%;">Posición enviada:'+lat+', '+lon+'</p>'
		}
		
})





socket.on('conexion',function(data){
	
	
	output.innerHTML+=`<p style="padding-left: 3%;"><strong>Un usuario ha ingresado</strong></p>`
});

socket.on('conexionyo',function(data){
	
	mensaje.value='';
	output.innerHTML+=`<p style="padding-left: 3%;"><strong>Has ingresado</strong></p>`
});


socket.on('chat:mensaje',function(data){
	
	mensaje.value='';
	output.innerHTML+=`<p style="padding-left:1%"><span style="font-size: 12px">${data.fecha}</span><span style="padding-left:1%"><strong>${data.usuario}</strong>: ${data.mensaje}</span></p>`;
	output.scrollTop=output.scrollHeight;
});


socket.on('userlist',function(users){

	
	userlist.innerHTML=`${users.map(user=>`<li style="padding: 2%;font-size:16px"><a href="../geol" target='_blank' rel="noopener noreferrer"><button style='color:powderblue;background:transparent;border:none' value='${user.socketid}' onclick='userselected(this.value)'>${user.usernamen}</button></a>${user.funciona}</li>`).join('')}`
})



function userselected(username){
	socket.emit('spy',username)
}


socket.on('archivo',(result)=>{
	
	
		
		output.innerHTML=`${result.map(result=>`<li style="padding-left: 3%;"><span style="font-size: 12px">${result.timestamp}</span><span style="padding-left:1%"><strong>${result.usuario}</strong>: ${result.mensaje}</span></li>`).join('')}`
		
	
})
