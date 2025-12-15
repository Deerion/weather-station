#ifndef WIFI_MANAGER_H 
#define WIFI_MANAGER_H

#include <Arduino.h>

#include <Arduino.h> 

void setupNetwork();
bool isNetworkConnected();
String getNetworkName();

#endif