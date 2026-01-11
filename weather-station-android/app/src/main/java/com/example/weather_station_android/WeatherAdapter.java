package com.example.weather_station_android;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

public class WeatherAdapter extends RecyclerView.Adapter<WeatherAdapter.WeatherViewHolder> {

    private final List<WeatherReading> weatherList;

    public WeatherAdapter(List<WeatherReading> weatherList) {
        this.weatherList = weatherList;
    }

    @NonNull
    @Override
    public WeatherViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_weather, parent, false);
        return new WeatherViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull WeatherViewHolder holder, int position) {
        WeatherReading reading = weatherList.get(position);

        // 1. Temperatura i Wilgotność
        holder.textTemp.setText(String.format(Locale.getDefault(), "%.1f°C", reading.temperature));
        holder.textHumidity.setText(String.format(Locale.getDefault(), "💧 %.0f%%", reading.humidity));

        // 2. Data i Czas
        try {
            OffsetDateTime odt = OffsetDateTime.parse(reading.createdAt);
            ZonedDateTime localTime = odt.atZoneSameInstant(ZoneId.systemDefault());

            LocalDate datePart = localTime.toLocalDate();
            LocalDate today = LocalDate.now();

            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            holder.textTime.setText(localTime.format(timeFormatter));

            if (datePart.equals(today)) {
                holder.textDate.setText("Dzisiaj");
                holder.textDate.setTextColor(Color.parseColor("#43A047")); // Zielony
            } else if (datePart.equals(today.minusDays(1))) {
                holder.textDate.setText("Wczoraj");
                holder.textDate.setTextColor(Color.parseColor("#FB8C00")); // Pomarańczowy
            } else {
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
                holder.textDate.setText(localTime.format(dateFormatter));
                holder.textDate.setTextColor(Color.GRAY);
            }

        } catch (Exception e) {
            holder.textTime.setText("Błąd");
            holder.textDate.setText("-");
            e.printStackTrace();
        }
    }

    @Override
    public int getItemCount() {
        return weatherList.size();
    }

    static class WeatherViewHolder extends RecyclerView.ViewHolder {
        TextView textTime, textDate, textTemp, textHumidity;

        public WeatherViewHolder(@NonNull View itemView) {
            super(itemView);
            textTime = itemView.findViewById(R.id.item_time);
            textDate = itemView.findViewById(R.id.item_date);
            textTemp = itemView.findViewById(R.id.item_temp);
            textHumidity = itemView.findViewById(R.id.item_humidity);
        }
    }
}