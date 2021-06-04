import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import "fontsource-roboto/latin.css";
import "./setup/axios";
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import { deepPurple, teal, grey } from "@material-ui/core/colors";
import { getDarkModePreference } from "./session";

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    background: {
      default: "#fffff",
    },
    primary: {
      main: "#FE6B8B",
    },
    secondary: {
      main: "#FF8E53",
    },
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#2F4858",
      paper: "#2F4858",
    },
    primary: {
      main: "#FE6B8B",
    },
    secondary: {
      main: "#FF8E53",
    },
  },
});

const darkMode = getDarkModePreference();

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
