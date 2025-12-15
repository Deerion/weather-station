# Firmware - Inteligentna Stacja Pogodowa

Ten katalog zawiera kod źródłowy dla mikrokontrolera ESP32, napisany w środowisku Arduino IDE (C++). System odpowiada za odczyt danych z czujników, prezentację ich na ekranie OLED oraz wysyłkę do chmury (Supabase).

## 🚀 Główne Funkcjonalności

* **Modułowa Architektura:** Kod podzielony na logiczne bloki (Sensory, Sieć, Ekran, Chmura) dla łatwiejszego rozwoju.
* **Redundancja WiFi:** Automatyczne przełączanie między siecią domową a mobilnym hotspotem w przypadku utraty połączenia.
* **Obsługa Czujników:**
    * **BME280:** Precyzyjny pomiar temperatury, wilgotności i ciśnienia.
    * **MQ-135:** Pomiar jakości powietrza z algorytmem przeliczania rezystancji sensora.
* **Dashboard OLED:** Wyświetlanie statusu połączenia, IP oraz bieżących odczytów na ekranie 0.96".
* **Integracja z Chmurą:** Wysyłanie danych JSON do bazy Supabase przez REST API.

## 📂 Struktura Plików

Projekt wykorzystuje podział na pliki nagłówkowe (`.h`) i źródłowe (`.cpp`):

* `weather-station.ino` - Główny plik (setup i loop).
* `config.h` - Mapowanie pinów i stałe kalibracyjne.
* `secrets.h` - Hasła WiFi i klucze API (plik ignorowany przez Git).
* `wifi_manager.*` - Logika łączenia z siecią i obsługa błędów.
* `sensors.*` - Obsługa BME280 i MQ-135.
* `display.*` - Obsługa ekranu SSD1306 i interfejsu graficznego.
* `cloud.*` - Klient HTTP do komunikacji z Supabase.
* `types.h` - Współdzielone struktury danych.

## ⚙️ Wymagane Biblioteki

Zainstaluj w Menedżerze Bibliotek Arduino IDE (*Szkic → Dołącz bibliotekę → Zarządzaj bibliotekami* lub `Ctrl+Shift+I`):

1.  **Adafruit GFX Library**
2.  **Adafruit SSD1306**
3.  **Adafruit BME280 Library**
4.  **ArduinoJson** (wersja 6.x lub 7.x)
5.  **Adafruit Unified Sensor**

## 🔧 Konfiguracja i Uruchomienie

### 1. Przygotowanie pliku Secrets
Ze względów bezpieczeństwa plik z hasłami nie znajduje się w repozytorium.
1.  Pobierz plik `secrets_example.h`.
2.  Zmień jego nazwę na `secrets.h`.
3.  Uzupełnij w środku swoje dane:
    ```cpp
    #define WIFI_SSID "TwojaSiec"
    #define WIFI_PASS "TwojeHaslo"
    // ... oraz klucze Supabase
    ```

### 2. Ustawienia Płytki (Arduino IDE)
* **Płytka:** DOIT ESP32 DEVKIT V1 (lub ESP32 Dev Module)
* **Port:** Wybierz odpowiedni port COM po podłączeniu USB.
* **Prędkość Uploadu:** 921600 (dla szybszego wgrywania).

### 3. Kalibracja (Opcjonalnie)
W pliku `config.h` możesz dostosować stałe kalibracyjne dla czujnika MQ-135 (np. `RO_CLEAN_AIR`) w zależności od specyfiki Twojego sensora.

## 📊 Format Danych (JSON)
Stacja wysyła dane do API w następującym formacie:
```json
{
  "temperature": 24.5,
  "humidity": 45.2,
  "pressure": 1013.25,
  "air_quality_index": 3.4,
  "air_status": "DOBRE"
}
