var base_url = "ws://145.24.222.116:8000/dashboard/ws/";
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

    
    // const config = {
    //     type: 'line',
    //     data: {
    //         labels: values.data,
    //         datasets: [
    //         {
    //             label: 'Humidity',
    //             data: values.data.humidity
    //         },
    //         {
    //             label: 'Temperature',
    //             data: values.data.temperature
    //         },
    //         {
    //             label: 'Wind Speed',
    //             data: values.data.wind_speed
    //         },
    //         {
    //             label: 'Light intensity',
    //             data: values.data.light_intensity
    //         }
    //     ],
    //     },
    //     options: {
    //       responsive: true,
    //     }
    //   };

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
            label: 'temperature',
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
    // const c1 = new Chart(ctx, config);
    c2 = new Chart(ctx1, slim_config)
    c2.update();
    url = 'http://145.24.222.116:8000/api/weather/?ordering=-id&weather_station=1';
    console.log(url);
    data = fetch(url).then(data=>{return data.json()}).then(res=>{
      console.log(res);
      var knobs = [];
      for(value in res[0].data){
          console.log(value);
          console.log(res[0].data[value])
          var k1 = pureknob.createKnob(150,150);
          k1.setProperty("angleStart", -0.75 * Math.PI);
          k1.setProperty("angleEnd", 0.75 * Math.PI);
          k1.setProperty("colorFG", "#88ff88");
          k1.setProperty("colorLabel", "#000000");
          k1.setProperty("readonly", true);
          k1.setProperty("label", value);
          k1.setValue(res[0].data[value]);
          g1.appendChild(k1.node()); 
          knobs.push(k1.node());
      }
    });

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
  url = "http://145.24.222.116:8000/api/weather?format=json&time__time__gte="+ start_time +"&time__time__lte="+ end_time;
  console.log(url);
  xhttp.responseType = 'json';
  xhttp.open("GET", url, true);
  xhttp.send();
  xhttp.onload = function() {
    res = xhttp.response;
    for(var i = 0; i < res.length; i++){
      c2.data.labels.push(res[i]['time']);

      c2.data.datasets.push(labels);
      for(val in res[i].data){
        for(dataset in c2.data.datasets){
          if(c2.data.datasets[i].label == val){
            console.log("MATCHHHH");
            c2.data.datasets[i].data.push(res[i].data[val]);
            // res[i].data.remove(val);
          }
        }
      }

      console.log(res);

      // addData2(c2, 'label', res[i])
      // c2.data.datasets[0].data.push(res[i].data['humidity']);
      // c2.data.datasets[1].data.push(res[i].data['temperature']);
      // c2.data.datasets[2].data.push(res[i].data['wind_speed']);
      // c2.data.datasets[3].data.push(res[i].data['light_intensity']);
    }
    console.log(c2.data);
    
    c2.update();
  }
}
