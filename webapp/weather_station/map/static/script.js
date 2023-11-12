const ctx = document.getElementById('myChart');
const g1 = document.getElementById('gauge1');

var base_url = "wss://whub.duckdns.org/dashboard/ws/";
const websocket = new WebSocket(base_url);

const slim_config = {
type: 'line',
options: {
  responsive: false,
  maintainAspectRatio: false,
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
daterange_config ={
    locale: { format: "DD/MM/YYYY HH:mm"},
    showDropdowns: true,
    timePicker: true,
    timePicker24Hour: true,
    autoApply: false,
    autoUpdateInput: false,
    alwaysShowCalendars: false,
    ranges: {
        Today: [
          moment().startOf('day'),
          moment().add(2, 'hours')
        ],
        Yesterday: [
          moment().subtract(1, 'days'),
          moment().startOf('day')
        ],
        "This week": [
          moment().subtract(1, 'weeks'),
          moment()
        ],
        "This month": [
          moment().subtract(1, 'months'),
          moment()
        ]
    },
}
$('input[name="daterange"], span[name="cal"]').daterangepicker(daterange_config
, function(start, end, label) {
  console.log("New date range selected: " + start.format() + " to " + end.utc().utcOffset(2, true).format('') + " (predefined range: " + label + ")");

  url = "https://whub.duckdns.org/api/weather?ordering=-id&weather_station=" + current_station + "&time__gte=" + start.format("YYYY-MM-DDTHH:mm:ss") + "&time__lte=" + end.format("YYYY-MM-DDTHH:mm:ss");
  open_station_url(url)
});

var knobs = [];
var current_station = 0;

function open_station_url(url){
    if(current_station != 0){
      var date_picker = document.getElementById("date_picker");
      date_picker.style = "display: show";
    }

    var info = document.getElementById("info_header");
    info.scrollIntoView(true, { behavior: "smooth", block: "start", inline: "center" });

    data = fetch(url).then(data=>{return data.json()}).then(res=>{
        res = res.results;
        if (res == undefined || res[0]== undefined){
            c2.clear();
            c2.canvas.style.display = 'none';
            return;
        }else{
          c2.canvas.parentNode.style.height = '100%';
        
          c2.canvas.style.display = 'block';
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

        }
    });

}

function open_station(e){
    if(current_station != 0){
      window["marker" + current_station]._icon.classList.remove("toRed");
    }
    current_station = parseInt(e.target.myID);
    if(current_station != 0){
      var date_picker = document.getElementById("date_picker");
      date_picker.style = "display: show";
    }
    window["marker" + e.target.myID]._icon.classList.add("toRed");

    var info = document.getElementById("info_header");
    info.innerHTML = e.target.username + "'s weather station";
    info.scrollIntoView(true, { behavior: "smooth", block: "start", inline: "center" });
    
    url = 'https://whub.duckdns.org/api/weather/?ordering=-id&limit=50&weather_station=' + e.target.myID;
    data = fetch(url).then(data=>{return data.json()}).then(res=>{
        res = res.results;
        if (res == undefined || res[0]== undefined){
            c2.clear();
            c2.canvas.parentNode.style.height = '0px';
            c2.canvas.style.display = 'none';
            return;
        }
        console.log("DIDNT RETURN");
        g1.innerHTML = '';
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
        Object.entries(res[0].data).forEach(function(key, value){
            datasets.push({
                label: key[0],
                data: res.map(function(d) {return d.data[key[0]]}).reverse()
            });
        });
        const data = {
            labels: lbls,
            datasets: datasets
        }
        console.log(data);
        c2.data = data;
        c2.update();
    });
}

websocket.onopen = function(e){
  console.log("COnnected!");
}

websocket.onmessage = function(event){
    var data = JSON.parse(event.data);
    console.log(data);
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
