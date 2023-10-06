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

        --TODO--

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
