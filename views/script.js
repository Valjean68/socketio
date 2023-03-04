const counters=document.querySelectorAll('.counter')


const speed=400

var a=0

counters.forEach(counter=>{
	const updateCount=()=>{
		const target=+counter.getAttribute('data-target')
		const count=+a

		const counts=+count

		const inc=target/speed

		if(counts<target){
			a=counts+inc
			
			counter.innerText=Math.trunc(a);
			setTimeout(updateCount,2)
		}else{
			counter.innerText=target
		}
	}
	updateCount()
})