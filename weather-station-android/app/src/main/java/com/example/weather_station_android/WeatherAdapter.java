package com.example.weather_station_android;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class WeatherAdapter extends RecyclerView.Adapter<WeatherAdapter.ViewHolder> {

    private final List<WeatherReading> readings;
    // Formater czasu: z ISO 8601 na ładną godzinę (HH:mm:ss)
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss")
            .withZone(ZoneId.systemDefault());

    public WeatherAdapter(List<WeatherReading> readings) {
        this.readings = readings;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_weather, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        WeatherReading item = readings.get(position);

        // Formatowanie temperatury i wilgotności
        holder.tempText.setText(String.format("%.1f°C", item.temperature));
        holder.humText.setText(String.format("%.1f%%", item.humidity));

        // Formatowanie czasu (z Supabase String -> Godzina)
        try {
            Instant instant = Instant.parse(item.createdAt);
            holder.timeText.setText(formatter.format(instant));
        } catch (Exception e) {
            holder.timeText.setText(item.createdAt);
        }
    }

    @Override
    public int getItemCount() {
        return readings.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView timeText, tempText, humText;

        public ViewHolder(View view) {
            super(view);
            timeText = view.findViewById(R.id.item_time);
            tempText = view.findViewById(R.id.item_temp);
            humText = view.findViewById(R.id.item_humidity);
        }
    }
}