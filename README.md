# ItsRainingThen
Project for the exam of "Serverless Computing for IOT"

# Introduction

The idea is to simulate a rain sensor and an anomemeter placed on the balcony of a house that warns us if it's raining with addition info if it's raining with high speed wind.

The main use for me is to notify the user when it's raining so that it can remove the clothes hanging outside.
The user is notified from a Telegram bot and he can choose to take action autonomously or call someone for help in case he cannot.

The sensors are currently simulated because i do not own such devices.

# Architecture

![architecture](https://user-images.githubusercontent.com/55919285/133073657-670a1548-6cff-4433-92b8-d7521d8891d2.png)


There are two simulated sensor so there is a need to simulate their messages to. It can be done via a function on Nuclio or using a MQTT Client. In this project has been used the latter approach, with an Android device using MQTT Dash (IoT, Smart Home).

The rain sensor send a 0 or 1 based on if it's raining or not while the wind sensor sends an integer that indicates the speed of the wind in kmh.
The messages are sent to iot/sensors/infoRain(for the rain sensor) and iot/sensors/infowind(for the anemometer).

Once a message is published on these queue the serverless funtions on Nuclio are then triggered. 
The "consumer-rain" funcion checks if the value published is 0 if so it's raining and publishes the message in iot/rainAlert.
The "consumer-wind" funcion checks if the value published is >49 if so there is strong wind and publishes the message in iot/windAlert.

At this stage if the IRT bot noticed a message published on iot/rainAlert it will check if there is also a message in iot/windAlert and based on the response it will send a message to the user via Telegram where it warn the user that is raining without or with the presence of strong winds.

# Projects Structure

* IRT.js: takes care of communication

* yaml-functions/
  * consumer-rain: process the values received by the rain sensor.
  * consumer-wind: process the values received by the wind sensor.

# Getting Started
> Pay attention: Its Raining Then requires **Docker and NodeJS**
Now, I'll guide you within the different phases of the installation
First of all open two different terminal,
+ Docker Nuclio run:

<pre>docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64</pre>
+ Docker RabbitMQ run:
 
<pre>docker run -p 9000:15672  -p 1883:1883 -p 5672:5672  cyrilix/rabbitmq-mqtt</pre>


In your browser search **localhost:8070** to check Nuclio installation and **localhost:9000** to check RabbitMQ installation.
Follow this instruction to import the project:
+ From the Nuclio homepage, create a new project
+ Press *Create function *, *Import* and from **yamlFolder** import the two functions
+ **Important**: in both the functions change the IP address with your IP, you'll find (*Put your IP here*) and from consumer function, go on trigger windows and change the IP again. 
+ Deploy both functions, **Deploy button** 
+ Now both functions are running!

How to create your Telegram Bot
+ Go on telegram, search **BotFather**
+ Press *start* and */newBot* command
+ Give it a name, and unique ID
+ Now, copy the bot token and paste it in the code of IRT.js, in var BOT_TOKEN (line 5)
+ In the same .js, insert your IP address, where are called the function "connect" (line 42 and 86)

+ Installation phase and dependencies
+ Open a terminal and write 
  + npm install
  + node src/IRT.js

+ Start Telegram Bot for the interaction
+ Set the MQTT Dash application as below.
<img src="https://user-images.githubusercontent.com/55919285/133108461-977e99ce-e234-46ab-8915-50027341b023.jpg" width="400">
* Create two buttons setted as follows
<img src="https://user-images.githubusercontent.com/55919285/133108530-643c4680-89dd-46ab-a2ca-c3157cb0647d.jpg" width="400">
<img src="https://user-images.githubusercontent.com/55919285/133108534-b485a4ad-914f-424c-b585-d36d485c9167.jpg" width="400">

Now you can start using it.




