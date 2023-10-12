const ctx = document.getElementById('myChart');
const g1 = document.getElementById('gauge1');

var base_url = "wss://whub.duckdns.org/dashboard/ws/";
const websocket = new WebSocket(base_url);

const slim_config = {
type: 'line',
options: {
  responsive: false,
  maintainAspectRatio: false,
  //aspectRatio: 3|1,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  legend: {
    position: 'top',
    align: 'start'
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 12
        },
        callback: function(val, index){
          console.log(val, index);
          return this.getLabelForValue(val).substring(9, 18); 
        },
        autoSkip: true,
        maxTicksLimit: 12
      }
    }
  }
}
};
let c2 = new Chart(ctx, slim_config);
c2.canvas.style.display = 'none';

var knobs = [];
var current_station = 0;

function open_station(e){
    current_station = parseInt(e.target.myID);
    var info = document.getElementById("info_header");
    info.innerHTML = e.target.username + "'s weather station";
    info.scrollIntoView(true, { behavior: "smooth", block: "start", inline: "center" });
    // document.getElementById("card_info").classList.add("show");
    document.getElementById("map").style.height = '10px';
    url = 'https://whub.duckdns.org/api/weather/?ordering=-id&limit=50&weather_station=' + e.target.myID;
    knobs = []
    data = fetch(url).then(data=>{return data.json()}).then(res=>{
        res = res.results;
        g1.innerHTML = '';
        if (res == undefined || res[0]== undefined){
            c2.clear();
            c2.canvas.parentNode.style.height = '0px';
            c2.canvas.style.display = 'none';
            return;
        }
        c2.canvas.parentNode.style.height = '100%';
	    
        c2.canvas.style.display = 'block';
        for(value in res[0].data){
            var k1 = pureknob.createKnob(125,125);
            k1.setProperty("angleStart", -0.75 * Math.PI);
            k1.setProperty("angleEnd", 0.75 * Math.PI);
            k1.setProperty("colorFG", "#88ff88");
            k1.setProperty("colorLabel", "#000000");
            k1.setProperty("readonly", true);
            k1.setProperty("label", value);
            k1.setValue(res[0].data[value]);
            g1.appendChild(k1.node()); 
            knobs.push(k1);

        }
        var lbls = res.map(function(d) {return d['time'].substring(2, 19);}).reverse();
        var datasets = [];
        Object.entries(res[res.length-1].data).forEach(function(key, value){
            datasets.push({
                label: key[0],
                data: res.map(function(d) {return d.data[key[0]]}).reverse()
            });
        });
        const data = {
            labels: lbls,
            datasets: datasets
        }
        c2.data = data;
        c2.update();
    });
}

websocket.onopen = function(e){
  console.log("COnnected!");
}

websocket.onmessage = function(event){
    var data = JSON.parse(event.data);
    if(data.weather_station == current_station){
      for(var i = 0; i < knobs.length; i++){
        var knob = knobs[i];
        knob.setValue(data.data[knob.getProperty("label")])
      }
      callREST();
    }
}

function callREST(){
  var xhttp = new XMLHttpRequest();
  console.log("RESTINGGGG");
  url = "https://whub.duckdns.org/api/weather?format=json&ordering=-id&limit=50&weather_station=" + current_station;
  data = fetch(url).then(data=>{return data.json()}).then(res=>{
      res = res.results;
      var lbls = res.map(function(d){return d['time'].substring(2, 19);}).reverse();
      var datasets = [];
      if(res.length > 0){
        Object.entries(res[res.length-1].data).forEach(function(key, value){
          datasets.push({
            label: key[0],
            data: res.map(function(d) {return d.data[key[0]];}).reverse()
          });
        });
        const chart_data = {
          labels: lbls,
          datasets: datasets
        }
        console.log(chart_data);
        c2.data = chart_data;
        c2.update();
      }
      console.log(res);
  });
}
