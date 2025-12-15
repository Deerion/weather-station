// pages/_app.tsx
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Tworzymy ciemny motyw
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#0a0a0a', // Bardzo ciemne tło
            paper: '#121212',   // Tło kart
        },
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
    },
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={darkTheme}>
            {/* CssBaseline resetuje style przeglądarki i nakłada ciemne tło na body */}
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}