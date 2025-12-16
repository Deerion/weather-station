package com.example.weather_station_android;

import com.example.weather_station_android.BuildConfig;
import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
    private static Retrofit retrofit = null;

    public static SupabaseApi getApi() {
        if (retrofit == null) {
            // Dodajemy nagłówki (apikey i Authorization) do każdego zapytania
            OkHttpClient client = new OkHttpClient.Builder().addInterceptor(new Interceptor() {
                @Override
                public Response intercept(Chain chain) throws IOException {
                    Request original = chain.request();
                    Request request = original.newBuilder()
                            .header("apikey", BuildConfig.SUPABASE_KEY)
                            .header("Authorization", "Bearer " + BuildConfig.SUPABASE_KEY)
                            .method(original.method(), original.body())
                            .build();
                    return chain.proceed(request);
                }
            }).build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(BuildConfig.SUPABASE_URL) // Bierze URL z local.properties
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(client)
                    .build();
        }
        return retrofit.create(SupabaseApi.class);
    }
}