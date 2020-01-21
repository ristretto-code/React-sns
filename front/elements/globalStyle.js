import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family:'NanumGothic';
    src: local("NanumGothic-Regular");
    src: local("NanumGothic-Bold");
    src: url(${require("~/Assets/Fonts/NanumGothic-Regular.ttf")});
    src: url(${require("~/Assets/Fonts/NanumGothic-Bold.ttf")});
  }
  body {
    font-family: 'NanumGothic', sans-serif;
  }
`;

export default GlobalStyle;