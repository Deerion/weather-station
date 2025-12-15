#include "wifi_manager.h"
#include "secrets.h"
#include "display.h" 
#include <WiFi.h>

bool tryConnect(const char* ssid, const char* pass) {
  showConnectionAttempt(ssid); // Pokazuje "Laczenie z..."

  Serial.print(F("Laczenie z: "));
  Serial.println(ssid);
  WiFi.begin(ssid, pass);
  
  int tryCount = 0;
  while (WiFi.status() != WL_CONNECTED && tryCount < 20) {
    delay(500);
    Serial.print(".");
    tryCount++;
  }
  Serial.println();
  return (WiFi.status() == WL_CONNECTED);
}

void setupNetwork() {
  WiFi.mode(WIFI_STA);
  
  // Próba 1: Dom
  if (!tryConnect(WIFI_SSID, WIFI_PASS)) {
    Serial.println(F("Domowe WiFi nie dziala. Probuje Mobile..."));
    
    // Restart radia (opcjonalny, czasem pomaga)
    WiFi.disconnect(true);  
    delay(1000); 
    WiFi.mode(WIFI_STA);
    delay(500);
    
    // Próba 2: Mobilne
    tryConnect(WIFI_SSID_MOBILE, WIFI_PASS_MOBILE);
  }

  // --- NOWOŚĆ: Wyświetlanie wyniku na ekranie ---
  bool isConnected = (WiFi.status() == WL_CONNECTED);
  String ssidName = isConnected ? WiFi.SSID() : "";
  
  showConnectionResult(isConnected, ssidName);
  // ----------------------------------------------

  if (isConnected) {
    Serial.println(F("Polaczono z WiFi!"));
  } else {
    Serial.println(F("Brak sieci."));
  }
}

bool isNetworkConnected() {
  return WiFi.status() == WL_CONNECTED;
}

String getNetworkName() {
  return WiFi.SSID();
}