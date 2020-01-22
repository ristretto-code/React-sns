import React from "react";
import propTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import axios from "axios";
import Helmet from "react-helmet";
import AppLayout from "../components/AppLayout";
import reducer from "../reducers";
import rootSaga from "../sagas";
import { LOAD_USER_REQUEST } from "../reducers/user";

const ReactSns = ({ Component, store, pageProps }) => (
  <Provider store={store}>
    <Helmet
      title="REACT SNS"
      htmlAttributes={{ lang: "ko" }}
      meta={[
        {
          charset: "UTF-8"
        },
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover"
        },
        {
          "http-equiv": "X-UA-Compatible",
          content: "IE=edge"
        },
        {
          name: "description",
          content: "React SNS by ristretto-code"
        },
        {
          name: "og:title",
          content: "ReactSns"
        },
        {
          name: "og:description",
          content: "React SNS by ristretto-code"
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:image",
          content: "../public/logo.png"
        }
      ]}
      link={[
        {
          rel: "shortcut icon",
          href: "/favicon.ico"
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
        },
        {
          rel: "stylesheet",
          href:
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        },
        {
          rel: "stylesheet",
          href:
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        }
      ]}
      script={[
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/antd/3.25.3/antd.js"
        }
      ]}
    />
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  </Provider>
);

ReactSns.propTypes = {
  Component: propTypes.elementType,
  store: propTypes.object,
  pageProps: propTypes.object
};

ReactSns.getInitialProps = async context => {
  const { ctx, Component } = context;

  let pageProps = {};
  const state = ctx.store.getState();
  const cookie = ctx.isServer ? ctx.req.headers.cookie : ""; // 서버에서 getinit할때 브라우저없이 쿠키보내주기위함
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie; // axios defaults에 쿠키넣음
  }
  if (!state.user.me) {
    // 내정보 없을시 가져오기
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST
    });
  }
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx); // Component들의 getInitialProps 실행
  }
  return { pageProps };
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const composeEnhancers =
    process.env.NODE_ENV === "production" // 배포할경우 devtools 없애기
      ? compose
      : typeof window === "object" &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export default withRedux(configureStore)(withReduxSaga(ReactSns));
