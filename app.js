let watchId=null
let routeMode=false
let endPoint=""

const startBtn=document.querySelector('.start')
const stopBtn=document.querySelector('.stop')

const latEl=document.getElementById('lat')
const lngEl=document.getElementById('lng')
const historyEl=document.getElementById('history')
const gauge=document.getElementById('speedGauge')
const mapDiv=document.getElementById('map')

const routeBtn=document.getElementById("routeBtn")

// ---------- ROUTE SEARCH ----------
routeBtn.onclick=()=>{
  const start=document.getElementById("startLoc").value
  const end=document.getElementById("endLoc").value

  if(!start||!end){
    alert("Enter both locations")
    return
  }

  routeMode=true
  endPoint=end

  mapDiv.innerHTML=`
  <iframe width="100%" height="100%" style="border:0"
  src="https://maps.google.com/maps?saddr=${start}&daddr=${end}&output=embed">
  </iframe>`
}

// ---------- SPEED GAUGE ----------
function updateGauge(speed){
  let deg=Math.min(speed*3.6,360)
  gauge.style.background=`conic-gradient(#00ffa6 ${deg}deg,#ffffff22 ${deg}deg)`
  gauge.textContent=Math.round(speed)
}

// ---------- START TRACK ----------
startBtn.onclick=()=>{

if(!navigator.geolocation){
alert("Geolocation not supported")
return
}

watchId=navigator.geolocation.watchPosition(

pos=>{
let lat=pos.coords.latitude
let lng=pos.coords.longitude
let speed=pos.coords.speed?pos.coords.speed*3.6:0

latEl.textContent=lat.toFixed(6)
lngEl.textContent=lng.toFixed(6)

updateGauge(speed)

// map update logic
if(routeMode){
mapDiv.innerHTML=`
<iframe width="100%" height="100%" style="border:0"
src="https://maps.google.com/maps?saddr=${lat},${lng}&daddr=${endPoint}&output=embed">
</iframe>`
}
else{
mapDiv.innerHTML=`
<iframe width="100%" height="100%" style="border:0"
src="https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed">
</iframe>`
}

// history
let item=document.createElement('div')
item.textContent=`${lat.toFixed(4)}, ${lng.toFixed(4)}`
historyEl.prepend(item)

},

err=>alert(err.message),
{enableHighAccuracy:true,maximumAge:0,timeout:5000}
)
}

// ---------- STOP TRACK ----------
stopBtn.onclick=()=>{
navigator.geolocation.clearWatch(watchId)
}
