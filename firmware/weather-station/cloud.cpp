#include "cloud.h"
#include "secrets.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

void sendToSupabase(WeatherData data) {
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    
    http.begin(SUPABASE_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", SUPABASE_KEY);
    http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);

    StaticJsonDocument<200> doc;
    doc["temperature"] = data.temp;
    doc["humidity"] = data.hum;
    doc["pressure"] = data.pres;
    doc["air_quality_index"] = data.airIndex;
    doc["air_status"] = data.airStatus;

    String jsonString;
    serializeJson(doc, jsonString);

    int httpResponseCode = http.POST(jsonString);

    if(httpResponseCode > 0){
      Serial.print("Wysylanie OK. Kod: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Blad wysylania: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}