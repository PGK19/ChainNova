async function addShipment(){

let origin = document.getElementById("origin").value
let destination = document.getElementById("destination").value
let weight = document.getElementById("weight").value

await fetch(`http://127.0.0.1:8000/add_shipment?origin=${origin}&destination=${destination}&weight=${weight}`,{
method:"POST"
})

loadShipments()
}

async function loadShipments(){

let res = await fetch("http://127.0.0.1:8000/shipments")
let data = await res.json()

let list = ""

data.forEach(s=>{
list += `<p>${s.origin} → ${s.destination} (${s.weight}kg)</p>`
})

document.getElementById("shipmentList").innerHTML = list
}