import { extendTheme } from "@chakra-ui/react";
import { CardComponent } from "./additions/card/card";
import { buttonStyles } from "./components/button";
import { badgeStyles } from "./components/badge";
import { inputStyles } from "./components/input";
import { progressStyles } from "./components/progress";
import { sliderStyles } from "./components/slider";
import { textareaStyles } from "./components/textarea";
import { switchStyles } from "./components/switch";
import { linkStyles } from "./components/link";
import { breakpoints } from "./foundations/breakpoints";
import { globalStyles } from "./styles";
const colors = {
  primary: {
    50: "rgb(255,244,218)",
    100: "rgb(255,255,255)",
    500: "rgb(201,20,41)",
    600: "rgb(141,18,24)",
  },
  secondary: {
    50: "rgb(220,221,222)",
    100: "rgb(119,120,123)",
    200: "rgb(65,64,66)",
    300: "rgb(0, 0, 0)",
    400: "rgb(124,34,122)",
    500: "rgb(115,185,100)",
    600: "rgb(189,215,83)",
    700: "rgb(247,116,00)",
    800: "rgb(255,215,80)",
  },
};

export default extendTheme(
  { breakpoints, colors }, // Breakpoints and colors
  globalStyles,
  badgeStyles, // badge styles
  buttonStyles, // button styles
  linkStyles, // link styles
  progressStyles, // progress styles
  sliderStyles, // slider styles
  inputStyles, // input styles
  textareaStyles, // textarea styles
  switchStyles, // switch styles
  CardComponent // card component
);
