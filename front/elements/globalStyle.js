import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family:'NanumGothic';
    src: url("../public/static/fonts/NanumGothic-Regular.ttf");
    src: url("../public/static/fonts/NanumGothic-Bold.ttf");
  }
  body {
    font-family: 'NanumGothic';
  }
`;

export default GlobalStyle;
