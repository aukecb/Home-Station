var base_url = "ws://localhost:8000/dashboard/ws/";
const websocket = new WebSocket(base_url);

websocket.onopen = function(e){
  console.log("COnnected!");
  // websocket.send(JSON.stringify(msg));
}

let c2 = null;

window.onload = function(){
    const ctx = document.getElementById('myChart');
    const ctx1 = document.getElementById('chart1');
    const g1 = document.getElementById('gauge1');
    const g2 = document.getElementById('gauge2');
    const g3 = document.getElementById('gauge3');
    const g4 = document.getElementById('gauge4');
    // console.log(time);

    const config = {
        type: 'line',
        data: {
            labels: time,
            datasets: [
            {
                label: 'Humidity',
                data: h_val
            },
            {
                label: 'Temperature',
                data: t_val
            },
            {
                label: 'Wind Speed',
                data: w_val
            },
            {
                label: 'Light intensity',
                data: l_val
            }
        ],
        },
        options: {
          responsive: true,
        }
      };

    const slim_config = {
      type: 'line',
      data: {
        labels: ['Sept. 19, 2023, 11:58 a.m.'],
        datasets: [
        {
            label: 'Humidity',
            data: [0]
        },
        {
            label: 'Temperature',
            data: [0]
        },
        {
            label: 'Wind Speed',
            data: [0]
        },
        {
            label: 'Light intensity',
            data : [0]
        }
        ]
      }
    };
    const c1 = new Chart(ctx, config);
    c2 = new Chart(ctx1, slim_config)
    c2.update();

    var k1 = pureknob.createKnob(150, 150);
    k1.setProperty("angleStart", -0.75 * Math.PI);
    k1.setProperty("angleEnd", 0.75 * Math.PI);
    k1.setProperty("colorFG", "#88ff88");
    k1.setProperty("readonly", true);
    k1.setProperty("label", "Temperature")
    k1.setValue(g1_val);
    g1.appendChild(k1.node());

    var k2 = pureknob.createKnob(150, 150);
    k2.setProperty("angleStart", -0.75 * Math.PI);
    k2.setProperty("angleEnd", 0.75 * Math.PI);
    k2.setProperty("colorFG", "#88ff88");
    k2.setProperty("readonly", true);
    k2.setProperty("label", "Humidity");
    k2.setValue(g2_val);
    g2.appendChild(k2.node());

    var k3 = pureknob.createKnob(150, 150);
    k3.setProperty("angleStart", -0.75 * Math.PI);
    k3.setProperty("angleEnd", 0.75 * Math.PI);
    k3.setProperty("colorFG", "#88ff88");
    k3.setProperty("readonly", true);
    k3.setProperty("label", "Wind Speed");
    k3.setValue(g3_val);
    g3.appendChild(k3.node());

    var k4 = pureknob.createKnob(150, 150);
    k4.setProperty("angleStart", -0.75 * Math.PI);
    k4.setProperty("angleEnd", 0.75 * Math.PI);
    k4.setProperty("colorFG", "#88ff88");
    k4.setProperty("readonly", true);
    k4.setProperty("label", "Light intensity");
    k4.setValue(g4_val);
    g4.appendChild(k4.node());

  websocket.onmessage = function(event){
      console.log("MESSAGE RECEIVED")
      var data = JSON.parse(event.data);
      console.log('data', data);
      k1.setValue(data['temperature']);
      k2.setValue(data['humidity']);
      k3.setValue(data['wind_speed']);
      k4.setValue(data['light_intensity']);
      g1.appendChild(k1.node());
      addData(c1, 'label', [data['humidity'], data['temperature'], data['wind_speed'], data['light_intensity']])
    c1.update();

      
  }
}

function addData(chart, label, newData){
  chart.data.labels.push(new Date());
  for(var i = 0; i < chart.data.datasets.length; i++){
    chart.data.datasets[i].data.push(newData[i]);
  }
  chart.update();
}

function addData2(chart, label, newData){
  chart.data.labels.push(newData['time']);
  let data = [newData['humidity'], newData['temperature'], newData['wind_speed'], newData['light_intensity']];
  for(var i = 0; i < chart.data.datasets.length; i++){
    chart.data.datasets[i].data.push(data[i]);
  }
  chart.update();

}

function callREST(){
  var xhttp = new XMLHttpRequest();
  console.log("RESTINGGGG");
  var start_time = document.getElementById('start_time').value;
  var end_time = document.getElementById('end_time').value;
  url = "http://localhost:8000/weather?format=json&time__time__gte="+ start_time +"&time__time__lte="+ end_time;
  console.log(url);
  xhttp.responseType = 'json';
  xhttp.open("GET", url, true);
  xhttp.send();
  xhttp.onload = function() {
    res = xhttp.response;
    console.log(c2.data);
    c2.data.labels = ['0'];
    console.log(c2.data.datasets[0]);
    for(var i = 0; i < c2.data.datasets.length; i++){
      c2.data.datasets[i].data = [0];
    }
    for(var i = 0; i < res.length; i++){
      // addData2(c2, 'label', res[i])
      c2.data.labels.push(res[i]['time']);
      c2.data.datasets[0].data.push(res[i]['humidity']);
      c2.data.datasets[1].data.push(res[i]['temperature']);
      c2.data.datasets[2].data.push(res[i]['wind_speed']);
      c2.data.datasets[3].data.push(res[i]['light_intensity']);
    }
    console.log(c2.data);
    
    c2.update();
  }
}
