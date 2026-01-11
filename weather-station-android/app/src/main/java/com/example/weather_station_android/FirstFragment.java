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
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.weather_station_android.databinding.FragmentFirstBinding;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FirstFragment extends Fragment {

    private FragmentFirstBinding binding;
    private static final String TAG = "WeatherApp";

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

        binding.recyclerHistory.setLayoutManager(new LinearLayoutManager(getContext()));

        // Pull-to-Refresh
        binding.swipeRefresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                binding.statusText.setText("ODŚWIEŻANIE...");
                binding.statusContainer.setCardBackgroundColor(Color.parseColor("#1976D2"));
                fetchWeatherData();
            }
        });

        fetchWeatherData();
        setupAutoRefresh();
    }

    private void fetchWeatherData() {
        RetrofitClient.getApi().getLatestReading("*", "created_at.desc", 50)
                .enqueue(new Callback<List<WeatherReading>>() {
                    @Override
                    public void onResponse(Call<List<WeatherReading>> call, Response<List<WeatherReading>> response) {
                        binding.swipeRefresh.setRefreshing(false);

                        if (response.isSuccessful() && response.body() != null && !response.body().isEmpty()) {
                            List<WeatherReading> dataList = response.body();

                            updateMainCard(dataList.get(0));
                            checkOnlineStatus(dataList.get(0).createdAt);

                            // Powiadomienie (Alert mrozu)
                            if (getActivity() instanceof MainActivity) {
                                ((MainActivity) getActivity()).checkTemperatureAndNotify(dataList.get(0).temperature);
                            }

                            WeatherAdapter adapter = new WeatherAdapter(dataList);
                            binding.recyclerHistory.setAdapter(adapter);

                        } else {
                            Log.e(TAG, "Błąd pobierania: " + response.message());
                            showErrorStatus();
                        }
                    }

                    @Override
                    public void onFailure(Call<List<WeatherReading>> call, Throwable t) {
                        binding.swipeRefresh.setRefreshing(false);
                        Log.e(TAG, "Błąd sieci: " + t.getMessage());
                        showErrorStatus();
                    }
                });
    }

    private void updateMainCard(WeatherReading data) {
        if (binding == null) return;
        binding.textTemp.setText(String.format("%.1f°", data.temperature));
        binding.textHumidity.setText(String.format("%.0f%%", data.humidity));
        binding.textPressure.setText(String.format("%.0f hPa", data.pressure));

        String qualityText = (data.airStatus != null) ? data.airStatus : "Nieznana";
        binding.textAirQuality.setText("Jakość: " + qualityText + " (Indeks: " + (int)data.airQualityIndex + ")");
        binding.textAirQuality.setTextColor(Color.WHITE);
    }

    private void checkOnlineStatus(String lastMeasurementTime) {
        if (binding == null) return;
        try {
            Instant lastTime = OffsetDateTime.parse(lastMeasurementTime).toInstant();
            Instant now = Instant.now();

            long secondsDiff = ChronoUnit.SECONDS.between(lastTime, now);

            if (secondsDiff > 40) {
                // OFFLINE - Czerwony
                String timeAgo = formatDuration(secondsDiff);
                binding.statusContainer.setCardBackgroundColor(Color.parseColor("#E53935"));
                binding.statusText.setText("🔴 OFFLINE (" + timeAgo + ")");
            } else {
                // ONLINE - Zielony
                binding.statusContainer.setCardBackgroundColor(Color.parseColor("#43A047"));
                binding.statusText.setText("🟢 SYSTEM ONLINE");
            }

        } catch (Exception e) {
            e.printStackTrace();
            binding.statusText.setText("⚠️ BŁĄD DATY");
        }
    }

    private String formatDuration(long totalSeconds) {
        if (totalSeconds < 60) {
            return totalSeconds + "s";
        }

        long minutes = totalSeconds / 60;
        if (minutes < 60) {
            return minutes + " min";
        }

        long hours = minutes / 60;
        long remMinutes = minutes % 60;
        if (hours < 24) {
            return hours + " godz. " + remMinutes + " min";
        }

        long days = hours / 24;
        long remHours = hours % 24;
        if (days < 30) {
            return days + " dni " + remHours + " godz.";
        }

        long months = days / 30;
        long remDays = days % 30;
        return months + " mies. " + remDays + " dni";
    }

    private void showErrorStatus() {
        if (binding != null) {
            binding.statusContainer.setCardBackgroundColor(Color.GRAY);
            binding.statusText.setText("❌ BŁĄD POŁĄCZENIA");
        }
    }

    private void setupAutoRefresh() {
        refreshRunnable = new Runnable() {
            @Override
            public void run() {
                fetchWeatherData();
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