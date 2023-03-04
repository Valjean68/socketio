const socket=io()


socket.on('mapita',(data)=>{

	var coord={lat:36.39856723076457,lng:25.462170532372436}
	console.log(coord)
	var map=new google.maps.Map(document.getElementById('map'),{
		zoom:10,
		center: coord
	})
})


socket.on('geoloc',function(data){
	


	

	var coord={lat:data.lat,lng:data.lon}
	console.log(coord)
	var map=new google.maps.Map(document.getElementById('map'),{
		zoom:15,
		center: coord
	})
	var marker=new google.maps.Marker({
		position:coord,
		map:map
	})



})