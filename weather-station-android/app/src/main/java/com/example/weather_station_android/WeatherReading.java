package com.example.weather_station_android;

import com.google.gson.annotations.SerializedName;

public class WeatherReading {
    // Odpowiada kolumnie: id bigint
    @SerializedName("id")
    public long id;

    // Odpowiada kolumnie: created_at timestamp
    @SerializedName("created_at")
    public String createdAt;

    // Odpowiada kolumnie: temperature numeric
    @SerializedName("temperature")
    public float temperature;

    // Odpowiada kolumnie: humidity numeric
    @SerializedName("humidity")
    public float humidity;

    // Odpowiada kolumnie: pressure numeric
    @SerializedName("pressure")
    public float pressure;

    // ✅ WAŻNE: W bazie masz "air_quality_index", a nie "air_quality"
    @SerializedName("air_quality_index")
    public float airQualityIndex;

    // ✅ NOWOŚĆ: Dodajemy pole "air_status" (text), którego wcześniej nie było
    @SerializedName("air_status")
    public String airStatus;
}