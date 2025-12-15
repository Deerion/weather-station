# 🌦️ Inteligentna Stacja Pogodowa (IoT)

Kompletny system monitorowania warunków środowiskowych oparty na mikrokontrolerze ESP32, zintegrowany z chmurą oraz dostępny poprzez aplikacje klienckie.

![Status Projektu](https://img.shields.io/badge/Status-Development-orange)
![Platforma](https://img.shields.io/badge/Platform-ESP32-blue)
![Backend](https://img.shields.io/badge/Backend-Supabase-green)

## 📖 O Projekcie

Celem projektu jest stworzenie autonomicznej stacji pogodowej, która mierzy parametry powietrza w czasie rzeczywistym i udostępnia je użytkownikowi w wielu kanałach (Ekran OLED, WWW, Android). System został zaprojektowany z myślą o niezawodności (redundancja WiFi) oraz skalowalności.

### ⚡ Główne Funkcjonalności
* **Pomiary:** Temperatura, Wilgotność, Ciśnienie atmosferyczne (BME280) oraz Jakość powietrza (MQ-135).
* **Łączność:** Automatyczne przełączanie między siecią domową a mobilnym hotspotem (Failover).
* **Chmura:** Wysyłanie danych pomiarowych do bazy danych **Supabase** (REST API).
* **Interfejsy:**
    * Lokalny: Wyświetlacz OLED 0.96".
    * Zdalny: Panel WWW oraz Aplikacja Mobilna.

---

## 📂 Struktura Repozytorium

Projekt podzielony jest na niezależne moduły. Kliknij w folder, aby zobaczyć szczegółową dokumentację techniczną:

| Katalog | Opis | Technologie |
| :--- | :--- | :--- |
| [**`/firmware`**](./firmware) | Kod źródłowy dla mikrokontrolera. | C++, Arduino IDE |
| [**`/hardware`**](./hardware) | Schematy połączeń, PCB, lista części (BOM). | Fritzing/EasyEDA, PDF |
| [**`/weather-station-web`**](./weather-station-web) | Panel przeglądarkowy do wizualizacji danych. | React / Next.js (Web) |
| [**`/weather-station-android`**](./weather-station-android) | Aplikacja mobilna na telefony. | Android / Kotlin / Java |

---

## 🛠️ Technologie

### Hardware
* **MCU:** ESP32 DevKit V1
* **Sensory:** BME280 (I2C), MQ-135 (Analog)
* **Display:** SSD1306 OLED (I2C)

### Software
* **Firmware:** Arduino Framework (C++)
* **Backend:** Supabase (PostgreSQL + REST API)
* **Frontend:** HTML/JS/Frameworks (Web & Mobile)

---

## 🚀 Jak uruchomić projekt?

Aby zbudować własną kopię stacji, wykonaj kroki w następującej kolejności:

1.  **Skompletuj sprzęt:** Wejdź do katalogu [**`/hardware`**](./hardware) i sprawdź listę części (BOM) oraz schemat połączeń.
2.  **Wgraj oprogramowanie:**
    * Wejdź do [**`/firmware`**](./firmware).
    * Skonfiguruj plik `secrets.h` (na podstawie `secrets_example.h`).
    * Wgraj kod na ESP32 przy użyciu Arduino IDE.
3.  **Uruchom aplikacje:** (Opcjonalnie) Skonfiguruj klienta Web lub Android zgodnie z instrukcjami w ich folderach.

---

## 🔒 Bezpieczeństwo
Repozytorium nie zawiera poufnych danych (hasła WiFi, klucze API).
Wszystkie pliki konfiguracyjne zawierające wrażliwe dane (np. `secrets.h`, `.env.local`, `local.properties`) są ignorowane przez system Git.

Aby uruchomić projekt, należy utworzyć te pliki lokalnie na podstawie dostarczonych szablonów (np. `secrets_example.h`).

---

## 👥 Autorzy
* **Hubert Jarosz**
* **Karol Kondracki**

Projekt realizowany w ramach przedmiotu: *Systemy Wbudowane*.
