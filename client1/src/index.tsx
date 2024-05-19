import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Backdrop, Button, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { ruRU } from '@mui/material/locale';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getErrorMessage } from './utils/config/config';

if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
  console.warn = () => {}
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#6639ba"
    },
    background: {
      default: "#e4deff"
    }
  },

  components: {
    MuiAppBar: {

    },
    MuiToolbar: {
      styleOverrides: {
        dense: {
          height: "60px",
          minHeight: "60px"
        }
      }
    },
    MuiDialog: {
      defaultProps: {
        scroll: "body",
        slotProps: {
          backdrop: {
            // sx: {
            //   backgroundColor: "#ffffff75",
            //   backdropFilter: "blur(20px)"
            // }
          }
        }
      },
      styleOverrides: {
        paper: {
          // boxShadow: "none",
          // border: "1px solid #bbb"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // textTransform: "none"
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: "medium"
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 6
        // variant: "outlined"
      }
    }
  }
}, ruRU)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    },
    mutations: {
      onError: (e) => toast.error(getErrorMessage(e, "Неизвестная ошибка"))
    }
  },
})


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer autoClose={2000} position="top-right" hideProgressBar pauseOnHover closeOnClick pauseOnFocusLoss={false} />
    </ThemeProvider>
  </QueryClientProvider>
);