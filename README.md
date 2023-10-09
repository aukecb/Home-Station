# Home Station
Server and dashboard for my home station. Minor Smart Things 2023

## Using the hub

DISCLAIMER: the weather station hub is currently still under development don't expect any data to be kept!!!

### Setting up your account

* Go to the server website: [https://whub.duckdns.org](https://whub.duckdns.org)

* Create a new account by pressing `Sign Up` button.

* Once you created your account, proceed by pressing the `Login` button and log in with your credentials

* Once your logged in create your own weatherstation by pressing `Create Weatherstation`

* Specify your weather station's location either by using the map or entering the coordinates yourself (optional) add url to your own dashboard

### Connecting your weatherstation to the server

* Add following code to use mqtt
    <details>
    <summary>MQTT code</summary>

        #include <Arduino.h>
        #include <WiFi.h>
        #include <PubSubClient.h>
        #include <HTTPClient.h>


        const char* ssid = "Tesla IoT";
        const char* password = "fsL6HgjN";

        const char* mqtt_server = "145.24.222.116";
        const char* mqtt_user = "minor";
        const char* mqtt_pass = "smartthings2023";
        const char* mqtt_topic = "weather";

        WiFiClient wifi_client;
        PubSubClient client(wifi_client);

        long last_msg = 0;
        char msg[50];
        int value = 0;

        void callback(char* topic, byte* message, unsigned int length);
        void reconnect();

        bool mqttConnect(){
          client.setServer(mqtt_server, 8884);
          client.setCallback(callback);
          Serial.print("Connecting to MQTT broker");
          while(!client.connected()){
            if(client.connect("esp32", mqtt_user, mqtt_pass)){
              Serial.println("CONNECTED TO MQTT");
            }else{
              Serial.print("Failed with state ");
              char err_buf[100];
              Serial.println(client.state());
              delay(2000);
            }
            Serial.print(".");
          }
          Serial.println();
          return true;
        }

        void initWiFi(){
          WiFi.mode(WIFI_STA);
          WiFi.begin(ssid, password);
          Serial.print("Connecting to WiFi...");
          while(WiFi.status() != WL_CONNECTED){
            Serial.print(".");
            delay(500);
          }
          Serial.println(WiFi.localIP());
          mqttConnect();
        }


        void setup() {
          // put your setup code here, to run once:
          Serial.begin(115200);
          initWiFi();
          dht.begin();
          delay(500);
        }

        void loop() {
          // put your main code here, to run repeatedly:
          float temp = dht.readTemperature();
          float humid = dht.readHumidity();
          Serial.println(temp);
          Serial.println(humid);
          if(WiFi.status() == WL_CONNECTED){
            if(client.connected()){
              String data = "{\"user\":\"auke\", \"weather_station\": 2, \"data\": {\"temperature\":\""+ (String)temp+"\",\"humidity\":\""+ (String)humid+"\",\"wind_speed\":4.0 ,\"light_intensity\":40}}";
              if(!isnan(temp) && !isnan(humid)){
                Serial.print("Sent: ");
                Serial.println(data);
                const char* d = data.c_str();
                client.publish(mqtt_topic, d);
              }
            }else{
              mqttConnect();
            }
          }else{
            initWiFi();
          }
          client.loop();
          delay(1000);
        }

  </details>

* Or use following code to use http

        --TODO--

* Setup using the following settings:

    ```
    Host: 145.24.222.116
    Port: 8884
    Username: minor
    Password: smartthings2023
    ```


### Sending data to the server

The server accepts data in JSON format, take a look at the examples:

```
{"user": "auke", "weather_station": 1, "data": {"humidity": 66.0, "temperature": 50, "wind_speed": 14, "gas": 20, "testval": 33, "speed": 44}}

{"user": "auke", "weather_station": 1, "data": {"humidity": 66.0, "temperature": 50}}
```

Make sure to use your own username and to specify your own weather station.

To get the ID of your weather station use the following link: [https://whub.duckdns.org/api/stations](https://whub.duckdns.org/api/stations) and look for your username.


### Final toughts

A dashboard is available at [http://whub.duckdns.org/dashboard] and is currently still under construction

You're welcome to create a pull request or create issues whenever you run into something or think some functionality could be improved.


## TODO

- [x] Set server to use HTTPS
- [ ] Encrypt MQTT traffic
- [x] Move to domain?
- [ ] Inform user when not logged in on map
- [ ] Create seperate dashboards for each user

## Developer setup

`docker compose up -d`
