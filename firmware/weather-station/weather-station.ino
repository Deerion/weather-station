#include <Wire.h>
#include "config.h"
#include "types.h"
#include "wifi_manager.h"
#include "sensors.h"
#include "display.h"
#include "cloud.h"

unsigned long lastSendTime = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);

  setupDisplay();
  showStartupScreen();
  delay(1000);

  setupSensors();
  setupNetwork();
  
  delay(2000); 
}

void loop() {
  WeatherData currentData = readSensors();

  bool wifiStatus = isNetworkConnected();

  updateDisplay(currentData, wifiStatus);

  if (millis() - lastSendTime > SEND_INTERVAL) {
    sendToSupabase(currentData);
    lastSendTime = millis();
  }
  
  delay(100);
}