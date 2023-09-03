import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  typography: { fontFamily: 'Mukta' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            backgroundColor: '#374366',
            color: '#1a1a1a',
          },
        },
      },
    },
  },
})
