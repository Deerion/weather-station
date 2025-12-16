package com.example.weather_station_android;

import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.weather_station_android.databinding.FragmentFirstBinding;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FirstFragment extends Fragment {

    private FragmentFirstBinding binding;
    private static final String TAG = "WeatherApp";

    // Handler do automatycznego odświeżania
    private final Handler handler = new Handler(Looper.getMainLooper());
    private Runnable refreshRunnable;

    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {
        binding = FragmentFirstBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Konfiguracja listy (RecyclerView)
        binding.recyclerHistory.setLayoutManager(new LinearLayoutManager(getContext()));

        // Pobierz dane na start
        fetchWeatherData();

        // Obsługa przycisku odświeżania (Floating Action Button)
        binding.buttonRefresh.setOnClickListener(v -> {
            binding.statusText.setText("ODŚWIEŻANIE...");
            // Używamy setCardBackgroundColor dla MaterialCardView (zamiast setBackgroundColor)
            binding.statusContainer.setCardBackgroundColor(Color.parseColor("#1976D2")); // Niebieski akcent
            fetchWeatherData();
        });

        // Automatyczne odświeżanie co 30 sekund
        setupAutoRefresh();
    }

    private void fetchWeatherData() {
        // Pobieramy 50 ostatnich pomiarów
        RetrofitClient.getApi().getLatestReading("*", "created_at.desc", 50)
                .enqueue(new Callback<List<WeatherReading>>() {
                    @Override
                    public void onResponse(Call<List<WeatherReading>> call, Response<List<WeatherReading>> response) {
                        if (response.isSuccessful() && response.body() != null && !response.body().isEmpty()) {
                            List<WeatherReading> dataList = response.body();

                            // 1. Zaktualizuj Główną Kartę (najnowszy pomiar)
                            updateMainCard(dataList.get(0));

                            // 2. Sprawdź status (ONLINE/OFFLINE)
                            checkOnlineStatus(dataList.get(0).createdAt);

                            // 3. Wypełnij listę historią
                            WeatherAdapter adapter = new WeatherAdapter(dataList);
                            binding.recyclerHistory.setAdapter(adapter);

                        } else {
                            Log.e(TAG, "Błąd pobierania: " + response.message());
                            showErrorStatus();
                        }
                    }

                    @Override
                    public void onFailure(Call<List<WeatherReading>> call, Throwable t) {
                        Log.e(TAG, "Błąd sieci: " + t.getMessage());
                        showErrorStatus();
                    }
                });
    }

    private void updateMainCard(WeatherReading data) {
        if (binding == null) return;

        // Formatowanie temperatury (prostsze, bez zbędnych liter, bo są w layoutcie)
        binding.textTemp.setText(String.format("%.1f°", data.temperature));

        // Wilgotność i Ciśnienie
        binding.textHumidity.setText(String.format("%.0f%%", data.humidity));
        binding.textPressure.setText(String.format("%.0f hPa", data.pressure));

        // Jakość powietrza
        String qualityText = (data.airStatus != null) ? data.airStatus : "Nieznana";
        binding.textAirQuality.setText("Jakość: " + qualityText + " (Indeks: " + (int)data.airQualityIndex + ")");

        // WAŻNE: Na niebieskim gradiencie kolorowy tekst (czerwony/zielony) jest nieczytelny.
        // Ustawiamy tekst na biały dla profesjonalnego kontrastu.
        binding.textAirQuality.setTextColor(Color.WHITE);
    }

    private void checkOnlineStatus(String lastMeasurementTime) {
        if (binding == null) return;
        try {
            // Parsowanie czasu z bazy (UTC)
            Instant lastTime = Instant.parse(lastMeasurementTime);
            Instant now = Instant.now();

            // Różnica w sekundach
            long secondsDiff = ChronoUnit.SECONDS.between(lastTime, now);
            // Log.d(TAG, "Ostatni pomiar był " + secondsDiff + " sekund temu.");

            if (secondsDiff > 40) { // Limit offline
                // OFFLINE - Czerwony (Material Red 600)
                binding.statusContainer.setCardBackgroundColor(Color.parseColor("#E53935"));
                binding.statusText.setText("🔴 OFFLINE (" + secondsDiff + "s)");
            } else {
                // ONLINE - Zielony (Material Green 600)
                binding.statusContainer.setCardBackgroundColor(Color.parseColor("#43A047"));
                binding.statusText.setText("🟢 SYSTEM ONLINE");
            }

        } catch (Exception e) {
            e.printStackTrace();
            binding.statusText.setText("⚠️ BŁĄD DATY");
        }
    }

    private void showErrorStatus() {
        if (binding != null) {
            // Szary kolor błędu
            binding.statusContainer.setCardBackgroundColor(Color.GRAY);
            binding.statusText.setText("❌ BŁĄD POŁĄCZENIA");
        }
    }

    private void setupAutoRefresh() {
        refreshRunnable = new Runnable() {
            @Override
            public void run() {
                fetchWeatherData();
                // Ponów za 30 sekund
                handler.postDelayed(this, 30000);
            }
        };
        handler.post(refreshRunnable);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (refreshRunnable != null) {
            handler.removeCallbacks(refreshRunnable);
        }
        binding = null;
    }
}