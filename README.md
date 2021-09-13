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


