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
  brand: {
    lightCream: 'rgb(255,244,218)', // light cream
    white: 'rgb(255,255,255)', // white
    primaryRed: 'rgb(201,20,41)',   // primary red
    darkRed: 'rgb(141,18,24)',   // dark red
  },
  secondary: {
    gold: 'rgb(255,215,80)',
    orange: 'rgb(247,116,00)',
    greenLight: 'rgb(189,215,83)',
    green: 'rgb(115,185,100)',
    purple: 'rgb(124,34,122)',
    black: 'rgb(0,0,0)',
    charcoal: 'rgb(65,64,66)',
    gray: 'rgb(255, 244, 218)',
    lightGray: 'rgb(220,221,222)',
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
