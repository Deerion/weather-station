// types.ts
export interface Measurement {
    id: number;
    created_at: string;
    temperature: number;
    humidity: number;
    pressure: number;
    air_quality_index: number;
    air_status: string; // np. "SWIETNE", "DOBRE", "ZLE! GAZY"
}