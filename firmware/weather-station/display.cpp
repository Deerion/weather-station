#include "display.h"
#include "config.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setupDisplay() {
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("Błąd OLED!"));
    for (;;);
  }
  display.clearDisplay();
}

void showStartupScreen() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(20, 20);
  display.println(F("STACJA POGODOWA"));
  display.setCursor(10, 40);
  display.println(F("Start Systemu..."));
  display.display();
}

void updateDisplay(WeatherData data, bool wifiConnected) {
  display.clearDisplay();
  
  // GÓRNA BELKA
  display.fillRect(0, 0, 128, 14, SSD1306_WHITE);
  display.setTextColor(SSD1306_BLACK, SSD1306_WHITE);
  display.setTextSize(1);
  
  String headerText = "JAKOSC: " + data.airStatus;
  int centerCursor = (128 - (headerText.length() * 6)) / 2; 
  if(centerCursor < 0) centerCursor = 0;
  display.setCursor(centerCursor, 3);
  display.print(headerText);

  // DANE
  display.setTextColor(SSD1306_WHITE);
  display.drawLine(0, 15, 128, 15, SSD1306_WHITE);
  display.drawLine(64, 15, 64, 64, SSD1306_WHITE);
  display.drawLine(0, 40, 128, 40, SSD1306_WHITE);
  
  // TEMP
  display.setCursor(2, 19); display.print(F("TEMP:"));
  display.setCursor(2, 29); display.print(data.temp, 1); display.print(F(" C"));

  // WILG
  display.setCursor(68, 19); display.print(F("WILG:"));
  display.setCursor(68, 29); display.print(data.hum, 1); display.print(F(" %"));

  // CISN
  display.setCursor(2, 44); display.print(F("CISN:"));
  display.setCursor(2, 54); display.print(data.pres, 0); display.print(F(" hPa"));

  // INDEX
  display.setCursor(68, 44); display.print(F("INDEX:")); 
  display.setCursor(68, 54); display.print(data.airIndex, 1); 

  if(wifiConnected) {
    display.drawPixel(127, 63, SSD1306_WHITE);
  }

  display.display();
}

void showConnectionAttempt(const char* ssid) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 15);
  display.println(F("Laczenie z:"));
  display.setCursor(0, 25);
  display.println(ssid);
  display.display();
}

void showConnectionResult(bool connected, String ssid) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(10, 30);

  if(connected) {
    // Sukces
    display.println(F("WiFi OK!"));
    display.setCursor(10, 45);
    // Skracamy nazwę, żeby się zmieściła
    if(ssid.length() > 12) ssid = ssid.substring(0, 12);
    display.println(ssid);
  } else {
    // Porażka
    display.println(F("Offline Mode"));
    display.setCursor(10, 45);
    display.println(F("Brak sieci"));
  }
  display.display();
  delay(2000); // Czekamy 2 sekundy, żeby użytkownik przeczytał
}