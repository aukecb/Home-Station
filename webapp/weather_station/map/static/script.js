    const ctx = document.getElementById('myChart');
    const ctx1 = document.getElementById('chart1');
    const g1 = document.getElementById('gauge1');
    const g2 = document.getElementById('gauge2');
    const g3 = document.getElementById('gauge3');
    const g4 = document.getElementById('gauge4');

    function open_station(e){
        var x = (new Date()).getTimezoneOffset() * 60000; 
        console.log(x);
        var curtime = Date.now();
        var prevtime = curtime - 15 * 60000;
        var localISOTime = (new Date(Date.now() - x - (15 * 60000))).toISOString().slice(0,-1);
        localISOTime = '';
        url = 'https://whub.duckdns.org/api/weather/?ordering=-id&time__time__gte='+ localISOTime  + '&weather_station=' + e.target.myID;
        console.log(url);
        data = fetch(url).then(data=>{return data.json()}).then(res=>{
            res = res[0];
            var knobs = [];
            g1.innerHTML = '';
            if (res == undefined){
                return;
            }
            for(value in res.data){
                console.log(value);
                console.log(res.data[value])
                var k1 = pureknob.createKnob(150,150);
                k1.setProperty("angleStart", -0.75 * Math.PI);
                k1.setProperty("angleEnd", 0.75 * Math.PI);
                k1.setProperty("colorFG", "#88ff88");
                k1.setProperty("colorLabel", "#000000");
                k1.setProperty("readonly", true);
                k1.setProperty("label", value);
                k1.setValue(res.data[value]);
                g1.appendChild(k1.node()); 
                knobs.push(k1.node());

            }

            
        });
    }

    // var k1 = pureknob.createKnob(150, 150);
    // k1.setProperty("angleStart", -0.75 * Math.PI);
    // k1.setProperty("angleEnd", 0.75 * Math.PI);
    // k1.setProperty("colorFG", "#88ff88");
    // k1.setProperty("colorLabel", "#000000");
    // k1.setProperty("readonly", true);
    // k1.setProperty("label", "Temperature");
    // k1.setValue(20);
    // g1.appendChild(k1.node());

    // var k2 = pureknob.createKnob(150, 150);
    // k2.setProperty("angleStart", -0.75 * Math.PI);
    // k2.setProperty("angleEnd", 0.75 * Math.PI);
    // k2.setProperty("colorFG", "#88ff88");
    // k2.setProperty("colorLabel", "#000000");
    // k2.setProperty("readonly", true);
    // k2.setProperty("label", "Humidity");
    // // k2.setValue(g2_val);
    // g2.appendChild(k2.node());

    // var k3 = pureknob.createKnob(150, 150);
    // k3.setProperty("angleStart", -0.75 * Math.PI);
    // k3.setProperty("angleEnd", 0.75 * Math.PI);
    // k3.setProperty("colorFG", "#88ff88");
    // k3.setProperty("colorLabel", "#000000");
    // k3.setProperty("readonly", true);
    // k3.setProperty("label", "Wind Speed");
    // k3.setValue(20);
    // g3.appendChild(k3.node());

    // var k4 = pureknob.createKnob(150, 150);
    // k4.setProperty("angleStart", -0.75 * Math.PI);
    // k4.setProperty("angleEnd", 0.75 * Math.PI);
    // k4.setProperty("colorFG", "#88ff88");
    // k4.setProperty("colorLabel", "#000000");
    // k4.setProperty("readonly", true);
    // k4.setProperty("label", "Light intensity");
    // // k4.setValue(g4_val);
    // g4.appendChild(k4.node());