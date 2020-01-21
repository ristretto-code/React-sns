import React from "react";
import Helmet from "react-helmet";
import Document, { Main, NextScript } from "next/document";
import PropTypes from "prop-types";
import { ServerStyleSheet } from "styled-components";
import GlobalStyle from "../elements/globalStyle";

class MyDocument extends Document {
  static getInitialProps(context) {
    const sheet = new ServerStyleSheet();
    //styled components SSR처리
    const page = context.renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, helmet: Helmet.renderStatic(), styleTags };
  }
  render() {
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
    const htmlAttrs = htmlAttributes.toComponent();
    const bodyAttrs = bodyAttributes.toComponent();
    return (
      <html {...htmlAttrs}>
        <head>
          {this.props.styleTags}
          {Object.values(helmet).map(el => el.toComponent())}
        </head>
        <body {...bodyAttrs}>
          <GlobalStyle />
          <Main />
          {process.env.NODE_ENV === "production" && (
            <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />
          )}
          <NextScript></NextScript>
        </body>
      </html>
    );
  }
}

MyDocument.propTypes = {
  helmet: PropTypes.object.isRequired,
  styleTags: PropTypes.object.isRequired
};

export default MyDocument;
