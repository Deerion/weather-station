// hooks/useWeather.ts
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { supabase } from '../utils/supabaseClient';
import { differenceInSeconds } from 'date-fns';
import { Measurement } from '../types/types';

// Fetcher pobiera dane z Supabase
const fetcher = async () => {
    const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) throw error;
    return data as Measurement[];
};

export const useWeather = () => {
    // 1. Konfiguracja SWR - odpytuje bazę co 3 sekundy
    const { data, error, isLoading } = useSWR('weather-data', fetcher, {
        refreshInterval: 3000,
        dedupingInterval: 1000,
    });

    const [isOffline, setIsOffline] = useState(false);

    // Pobieramy najnowszy pomiar
    const latest = data ? data[0] : null;
    const history = data ? [...data].reverse() : [];

    // 2. NOWOŚĆ: Efekt "Zegara" - sprawdza czas co 1 sekundę
    useEffect(() => {
        // Jeśli nie ma danych (np. pierwszy start), nie robimy nic
        if (!latest) return;

        // Funkcja sprawdzająca status
        const checkOfflineStatus = () => {
            const now = new Date();
            const lastSeen = new Date(latest.created_at);
            const diff = differenceInSeconds(now, lastSeen);

            // Jeśli minęło więcej niż 30 sekund -> OFFLINE
            // Jeśli mniej -> ONLINE
            setIsOffline(diff > 30);
        };

        // Sprawdź natychmiast po załadowaniu danych
        checkOfflineStatus();

        // Uruchom interwał, który sprawdza to co 1 sekundę
        // Dzięki temu, nawet jak baza nie zwraca nowych danych,
        // my lokalnie wiemy, że czas upływa.
        const timer = setInterval(checkOfflineStatus, 1000);

        // Sprzątanie timera przy odmontowaniu lub zmianie danych
        return () => clearInterval(timer);
    }, [latest]); // Ten efekt zresetuje się, gdy przyjdzie nowy pakiet (zmieni się 'latest')

    return {
        latest,
        history,
        isLoading,
        isError: error,
        isOffline, // Teraz ten stan aktualizuje się na żywo
        lastUpdate: latest ? new Date(latest.created_at) : null,
    };
};