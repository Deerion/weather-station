#ifndef TYPES_H
#define TYPES_H

#include <Arduino.h>

#include <Arduino.h>

struct WeatherData {
  float temp;
  float hum;
  float pres;
  float airIndex;
  String airStatus;
};

#endif