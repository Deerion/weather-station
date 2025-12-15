// pages/index.tsx
import React from 'react';
import Head from 'next/head';
import { useWeather } from '../hooks/useWeather';
import { StatCard } from '../components/StatCard';

import {
    Container,
    Typography,
    Box,
    Paper,
    Alert,
    Stack,
    Divider,
    LinearProgress,
    useTheme,
    useMediaQuery,
    Chip,
    Tooltip // <--- FIX: Importujemy Tooltip z MUI
} from '@mui/material';

// Icons
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SpeedIcon from '@mui/icons-material/Speed';
import AirIcon from '@mui/icons-material/Air';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Charts
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip, // <--- FIX: Zmieniamy nazwę Tooltipa z Recharts, żeby nie było konfliktu
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { format } from 'date-fns';

const glassPaperStyle = {
    p: 3,
    borderRadius: 4,
    bgcolor: 'rgba(20, 22, 35, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
};

export default function Dashboard() {
    const { latest, history, isLoading, isOffline, lastUpdate } = useWeather();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getAirQualityColor = (status: string) => {
        if (!status) return 'default';
        const s = status.toUpperCase();

        if (s.includes('SWIETNE')) return 'success';
        if (s.includes('DOBRE')) return 'success';
        if (s.includes('SREDNIE')) return 'warning';
        if (s.includes('ZLE') || s.includes('GAZY')) return 'error';
        return 'default';
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 0%, rgba(30, 35, 60, 1) 0%, rgba(5, 5, 10, 1) 80%)',
            py: { xs: 3, md: 5 },
            px: { xs: 1, sm: 0 }
        }}>
            <Head>
                <title>IoT Station Pro</title>
            </Head>

            <Container maxWidth="xl">

                {/* --- TOP BAR --- */}
                <Box sx={{
                    mb: { xs: 3, md: 5 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'flex-end' },
                    justifyContent: 'space-between',
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3, fontWeight: 'bold', display: 'block', mb: -0.5 }}>
                            DASHBOARD
                        </Typography>
                        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" sx={{ color: 'white' }}>
                            Weather Station <span style={{ color: '#2196F3' }}>Pro</span>
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 1, md: 0 } }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2, py: 0.5,
                                borderRadius: 10,
                                bgcolor: isOffline ? 'rgba(255, 50, 50, 0.1)' : 'rgba(16, 185, 129, 0.15)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid',
                                borderColor: isOffline ? 'error.main' : 'success.main',
                                color: isOffline ? 'error.main' : 'success.main',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            {isOffline ? <WifiOffIcon fontSize="small" /> : <WifiIcon fontSize="small" />}
                            <Typography variant="caption" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                                {isOffline ? 'OFFLINE' : 'SYSTEM ONLINE'}
                            </Typography>
                        </Box>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, ml: 1 }}>
                            Ostatni pakiet: {lastUpdate ? format(lastUpdate, 'HH:mm:ss') : '--:--:--'}
                        </Typography>
                    </Box>
                </Box>

                {isOffline && (
                    <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 20px rgba(211, 47, 47, 0.3)' }}>
                        Utracono połączenie ze stacją ESP32. Dane na wykresach mogą być nieaktualne.
                    </Alert>
                )}

                {/* --- UKŁAD GŁÓWNY (CSS GRID) --- */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' },
                    gap: 3
                }}>

                    {/* LEWA KOLUMNA */}
                    <Box sx={{ gridColumn: { xs: '1 / -1', lg: 'span 8' } }}>

                        {/* KARTY */}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 3,
                            mb: 3
                        }}>
                            <StatCard
                                title="Temperatura"
                                value={latest?.temperature}
                                unit="°C"
                                icon={DeviceThermostatIcon}
                                loading={isLoading}
                                offline={isOffline}
                                subValue="Zakres komfortu: 20°C - 25°C"
                            />
                            <StatCard
                                title="Wilgotność"
                                value={latest?.humidity}
                                unit="%"
                                icon={WaterDropIcon}
                                loading={isLoading}
                                offline={isOffline}
                            />
                            <StatCard
                                title="Ciśnienie Atm."
                                value={latest?.pressure}
                                unit="hPa"
                                icon={SpeedIcon}
                                loading={isLoading}
                                offline={isOffline}
                            />
                            <StatCard
                                title="Jakość Powietrza"
                                value={latest?.air_status || 'Nieznany'}
                                icon={AirIcon}
                                loading={isLoading}
                                offline={isOffline}
                                statusColor={getAirQualityColor(latest?.air_status || '')}
                                subValue={`Rs/R0 Index: ${latest?.air_quality_index?.toFixed(2)}`}
                            />
                        </Box>

                        {/* WYKRES TRENDÓW */}
                        <Paper sx={glassPaperStyle}>
                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="bold">Wykres Trendów</Typography>
                                <Typography variant="caption" color="text.secondary">(Ostatnie 50 pomiarów)</Typography>
                            </Box>

                            <Box sx={{ height: { xs: 300, md: 350 }, width: '100%' }}>
                                <ResponsiveContainer>
                                    <LineChart data={history} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="created_at"
                                            tickFormatter={(str) => format(new Date(str), 'HH:mm')}
                                            stroke="#666"
                                            fontSize={11}
                                            tickMargin={10}
                                        />
                                        <YAxis yAxisId="left" stroke="#90caf9" fontSize={11} domain={['auto', 'auto']} tickMargin={10} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#69f0ae" fontSize={11} domain={[0, 100]} tickMargin={10} />

                                        {/* FIX: Używamy RechartsTooltip */}
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(6px)', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}
                                            labelFormatter={(l) => format(new Date(l), 'HH:mm:ss')}
                                        />

                                        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#2196F3" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#2196F3' }} name="Temp (°C)" />
                                        <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#00E676" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#00E676' }} name="Wilg (%)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Box>

                    {/* PRAWA KOLUMNA */}
                    <Box sx={{ gridColumn: { xs: '1 / -1', lg: 'span 4' } }}>
                        <Stack spacing={3} sx={{ height: '100%' }}>

                            <Paper sx={{ ...glassPaperStyle, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 'bold' }}>
                                        Indeks Czystości (Rs/R0)
                                    </Typography>

                                    {/* FIX: Tutaj używamy Tooltip z MUI (ten z importu @mui/material) */}
                                    <Tooltip title="Im wyższy wynik tym lepiej! <1.5: Zła, 1.5-4.0: Średnia, 4.0-10.0: Dobra, >10.0: Świetna." placement="top">
                                        <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
                                    </Tooltip>
                                </Box>

                                <Box sx={{ flexGrow: 1, minHeight: 200, width: '100%', mt: 2 }}>
                                    <ResponsiveContainer>
                                        <AreaChart data={history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorAirQuality" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.9}/>
                                                    <stop offset="30%" stopColor="#4caf50" stopOpacity={0.8}/>
                                                    <stop offset="70%" stopColor="#eab308" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.8}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid stroke="none" />
                                            <XAxis dataKey="created_at" hide />
                                            <YAxis domain={[0, 14]} hide />

                                            {/* FIX: Używamy RechartsTooltip */}
                                            <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', borderRadius: '8px', border: 'none' }}
                                                             labelFormatter={(value) => format(new Date(value), 'dd.MM.yyyy HH:mm:ss')}
                                            />

                                            <ReferenceLine y={10.0} stroke="rgba(0, 230, 118, 0.4)" strokeDasharray="3 3" label={{ position: 'right', value: '10.0', fill: '#00E676', fontSize: 10 }} />
                                            <ReferenceLine y={4.0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" label={{ position: 'right', value: '4.0', fill: '#aaa', fontSize: 10 }} />
                                            <ReferenceLine y={1.5} stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="3 3" label={{ position: 'right', value: '1.5', fill: '#ef4444', fontSize: 10 }} />

                                            <Area
                                                type="monotone"
                                                dataKey="air_quality_index"
                                                stroke="url(#colorAirQuality)"
                                                fill="url(#colorAirQuality)"
                                                strokeWidth={2}
                                                name="Indeks Rs/R0"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>

                                <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                                    <Chip label="< 1.5 Zła" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.7rem' }} />
                                    <Chip label="1.5 - 4.0 Średnia" size="small" sx={{ bgcolor: 'rgba(234, 179, 8, 0.2)', color: '#facc15', fontSize: '0.7rem' }} />
                                    <Chip label="4.0 - 10.0 Dobra" size="small" sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: '#66bb6a', fontSize: '0.7rem' }} />
                                    <Chip label="> 10.0 Świetna" size="small" sx={{ bgcolor: 'rgba(0, 230, 118, 0.15)', color: '#69f0ae', fontSize: '0.7rem', border: '1px solid rgba(0,230,118,0.3)' }} />
                                </Box>
                            </Paper>

                            <Paper sx={glassPaperStyle}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">Status Systemu</Typography>

                                <Box sx={{ my: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" color="text.secondary">Częstotliwość próbkowania</Typography>
                                        <Typography variant="body2" color="primary" fontWeight="bold">~3.0s</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={100}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 4,
                                                background: 'linear-gradient(90deg, #2196F3 0%, #00E676 100%)'
                                            }
                                        }}
                                    />
                                </Box>

                                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }}>
                                        <CalendarTodayIcon fontSize="small" color="primary" />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Data uruchomienia sesji
                                        </Typography>
                                        <Typography variant="body2" color="white">
                                            {format(new Date(), 'dd MMMM yyyy', { })}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>

                        </Stack>
                    </Box>

                </Box>
            </Container>
        </Box>
    );
}