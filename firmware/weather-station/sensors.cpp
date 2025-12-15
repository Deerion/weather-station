#include "sensors.h"
#include "config.h"
#include <Wire.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;

void setupSensors() {
  pinMode(MQ135_PIN, INPUT);
  
  if (!bme.begin(0x76)) {
      Serial.println("Błąd BME280!");
  }
}

WeatherData readSensors() {
  WeatherData data;

  data.temp = bme.readTemperature();
  data.hum = bme.readHumidity();
  data.pres = bme.readPressure() / 100.0F;

  int analogValue = analogRead(MQ135_PIN);
  float V_D34 = analogValue * (ADC_MAX_VOLTAGE / ADC_RESOLUTION);
  float airVoltage = V_D34 * VOLTAGE_DIVIDER_CORRECTION; 
  
  float Rs = 0;
  if (airVoltage > 0) {
      Rs = ((SENSOR_VCC / airVoltage) - 1) * RL_VALUE;
  }
  data.airIndex = Rs / RO_CLEAN_AIR; 

  if (data.airIndex >= 10.0) data.airStatus = "SWIETNE";
  else if (data.airIndex >= 4.0) data.airStatus = "DOBRE";
  else if (data.airIndex >= 1.5) data.airStatus = "SREDNIE";
  else data.airStatus = "ZLE! GAZY"; 

  return data;
}