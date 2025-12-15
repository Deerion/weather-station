#ifndef DISPLAY_H
#define DISPLAY_H

#include <Arduino.h>

#include "types.h"

void setupDisplay();
void showStartupScreen();
void updateDisplay(WeatherData data, bool wifiConnected);

void showConnectionAttempt(const char* ssid);
void showConnectionResult(bool connected, String ssid); 

#endif