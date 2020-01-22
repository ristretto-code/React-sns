import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family:'NanumGothic';
    src: local("NanumGothic-Regular");
    src: local("NanumGothic-Bold");
    src: url("https://fonts.googleapis.com/css?family=Nanum+Gothic&display=swap");
  }
  body {
    font-family: 'NanumGothic', sans-serif;
  }
`;

export default GlobalStyle;
