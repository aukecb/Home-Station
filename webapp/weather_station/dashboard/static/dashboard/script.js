var base_url = "wss://whub.duckdns.org/dashboard/ws/";
const websocket = new WebSocket(base_url);

websocket.onopen = function(e){
  console.log("COnnected!");
}

let c2 = null;
var knobs = [];

window.onload = function(){
    // console.log(data);
    const ctx1 = document.getElementById('chart1');
    const g1 = document.getElementById('gauge1');
    const currentUrl = window.location.href;
    var user = currentUrl.split("/")
    user = user[user.length-1]
    const slim_config = {
      type: 'line',
    };

    c2 = new Chart(ctx1, slim_config)
    
    url = 'https://whub.duckdns.org/api/weather/?user=' + user;
    console.log(weather_data);
    console.log(url);
    data = fetch(url).then(data=>{return data.json()}).then(res=>{
      for(value in res[res.length-1].data){
          var k1 = pureknob.createKnob(150,150);
          k1.setProperty("angleStart", -0.75 * Math.PI);
          k1.setProperty("angleEnd", 0.75 * Math.PI);
          k1.setProperty("colorFG", "#88ff88");
          k1.setProperty("colorLabel", "#FFFFFF");
          k1.setProperty("readonly", true);
          k1.setProperty("label", value);
          k1.setValue(res[res.length-1].data[value]);
          g1.appendChild(k1.node()); 
          knobs.push(k1);
      }
      var lbls = res.map(function(d) { return d['time'];});
      var datasets = [];
      Object.entries(res[res.length-1].data).forEach(function(key, value){
        console.log(key);
        datasets.push({
          label: key[0],
          data: res.map(function(d) {return d.data[key[0]]})
        });
      });
      const data = {
        labels: lbls,
        datasets: datasets
      }
      c2.data = data;
      console.log(c2.data);
      c2.update();
    });

  websocket.onmessage = function(event){
      console.log("MESSAGE RECEIVED")
      var data = JSON.parse(event.data);
      for(var i = 0; i < knobs.length; i++){
        console.log(knobs[i].getProperty("label"));
        var knob = knobs[i];
        knob.setValue(data.data[knob.getProperty("label")])
      }
      callREST();
  }
}

function callREST(){
  var xhttp = new XMLHttpRequest();
  console.log("RESTINGGGG");
  var start_time = document.getElementById('start_time').value;
  var end_time = document.getElementById('end_time').value;
  url = "https://whub.duckdns.org/api/weather?format=json&time__time__gte="+ start_time +"&time__time__lte="+ end_time + "&user=" + user;
  xhttp.responseType = 'json';
  xhttp.open("GET", url, true);
  xhttp.send();
  xhttp.onload = function() {
    res = xhttp.response;
    var lbls = res.map(function(d) { return d['time'];});
    var datasets = []
    if(res.length > 0){
      Object.entries(res[res.length-1].data).forEach(function(key, value){
        datasets.push({
          label: key[0],
          data: res.map(function(d) {return d.data[key[0]]})
        });
      });
    }
    const data = {
      labels: lbls,
      datasets: datasets
    }
    c2.data = data;
    c2.update();
  }
}
