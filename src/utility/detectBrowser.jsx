import {UAParser} from "ua-parser-js";

//------------------------------------------------------------------------
// This function detects the browser type using the UAParser library
// and returns a string "ok" for supported browsers.
export const detectBrowser = () => {
  const parser = new UAParser();
  const browser = parser.getBrowser(); // Returns an object with browser details
  let browserName;

  switch (browser.name) {
    case "Chrome":
    case "Mobile Chrome":
    case "Firefox":
    case "Mobile Firefox":
    case "Safari":
    case "Mobile Safari":
    case "Edge":
    case "Mobile Edge":
    case "Opera":
    case "Mobile Opera":
    case "Samsung Internet":
      browserName = true;
      break;
    default:
      browserName = false;
  }

  return browserName;
};