// components/StatCard.tsx
import React from 'react';
import { Paper, Typography, Box, Skeleton, Chip } from '@mui/material';

// FIX: Używamy React.ElementType - to naprawia błąd TS2769 z ikonami
interface StatCardProps {
    title: string;
    value?: string | number;
    unit?: string;
    icon: React.ElementType;
    loading?: boolean;
    offline?: boolean;
    statusColor?: 'success' | 'warning' | 'error' | 'default';
    subValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
                                                      title,
                                                      value,
                                                      unit,
                                                      icon: Icon, // Przemianowujemy prop na Wielką Literę, żeby użyć jako komponentu
                                                      loading = false,
                                                      offline = false,
                                                      statusColor = 'default',
                                                      subValue
                                                  }) => {

    const gradients: Record<string, string> = {
        default: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
        warning: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(234, 179, 8, 0.05) 100%)',
        error: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.1) 100%)',
    };

    const activeGradient = offline ? gradients.default : (gradients[statusColor] || gradients.default);
    const iconColor = offline ? 'disabled' : (statusColor === 'default' ? 'primary' : statusColor);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                background: activeGradient,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' }}>
                    {/* Renderujemy ikonę jako komponent */}
                    <Icon color={iconColor as any} />
                </Box>
                {statusColor !== 'default' && !offline && !loading && (
                    <Chip
                        label="ALERT"
                        size="small"
                        color={statusColor as any}
                        sx={{ height: 20, fontSize: '0.6rem', fontWeight: 'bold' }}
                    />
                )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, letterSpacing: 1 }}>
                {title.toUpperCase()}
            </Typography>

            <Box sx={{ mt: 1 }}>
                {loading ? (
                    <Skeleton variant="rectangular" width="60%" height={40} sx={{ borderRadius: 1 }} />
                ) : (
                    <Typography variant="h3" fontWeight="bold" sx={{ color: offline ? 'text.disabled' : 'text.primary' }}>
                        {value}
                        <Typography component="span" variant="h6" sx={{ color: 'text.secondary', ml: 0.5, fontWeight: 400 }}>
                            {unit}
                        </Typography>
                    </Typography>
                )}
            </Box>

            {subValue && !loading && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {subValue}
                </Typography>
            )}
        </Paper>
    );
};