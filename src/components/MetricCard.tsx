// components/MetricCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    // Typ dla ikony MUI
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    statusColor?: 'default' | 'green' | 'red' | 'yellow';
}

export const MetricCard: React.FC<MetricCardProps> = ({
                                                          title,
                                                          value,
                                                          unit,
                                                          icon: Icon,
                                                          statusColor = 'default'
                                                      }) => {

    // Logika kolorów tła w zależności od statusu
    let bgColor = 'background.paper';
    let borderColor = 'transparent';
    let textColor = 'text.primary';

    if (statusColor === 'green') {
        bgColor = 'rgba(16, 185, 129, 0.15)'; // Delikatna zieleń
        borderColor = '#10b981';
    } else if (statusColor === 'red') {
        bgColor = 'rgba(239, 68, 68, 0.25)'; // Czerwień
        borderColor = '#ef4444';
    } else if (statusColor === 'yellow') {
        bgColor = 'rgba(234, 179, 8, 0.15)'; // Żółty
        borderColor = '#eab308';
    }

    return (
        <Card
            sx={{
                height: '100%',
                bgcolor: bgColor,
                border: '1px solid',
                borderColor: borderColor === 'transparent' ? 'divider' : borderColor,
                transition: '0.3s',
                // Jeśli czerwony, dodaj pulsowanie
                animation: statusColor === 'red' ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
                }
            }}
        >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: 'action.hover',
                        display: 'flex'
                    }}
                >
                    <Icon color="primary" />
                </Box>
                <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color={textColor}>
                        {value}
                        <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                            {unit}
                        </Typography>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};