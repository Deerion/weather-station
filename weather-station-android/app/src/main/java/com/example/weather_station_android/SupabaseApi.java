package com.example.weather_station_android;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface SupabaseApi {

    // ✅ ZMIANA: Tabela nazywa się "measurements", nie "weather_readings"
    @GET("/rest/v1/measurements")
    Call<List<WeatherReading>> getLatestReading(
            @Query("select") String select,
            @Query("order") String order,
            @Query("limit") int limit
    );
}