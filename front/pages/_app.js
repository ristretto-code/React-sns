import React from "react";
import propTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "../reducers";
import AppLayout from "../components/AppLayout";
import rootSaga from "../sagas";
import axios from "axios";
import Helmet from "react-helmet";
import { LOAD_USER_REQUEST } from "../reducers/user";

const ReactSns = ({ Component, store, pageProps }) => (
  <Provider store={store}>
    <Helmet
      title="NodeBird"
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
  Component: propTypes.elementType, // 모든 자료형을 포함하는 것은 node
  store: propTypes.object,
  pageProps: propTypes.object.isRequired
};

ReactSns.getInitialProps = async context => {
  //getInitialProps는 가장 먼저 시작하는 라이프싸이클이다.
  const { ctx, Component } = context;
  // server.js에서 보낸 param값이 context에 ctx로 담긴다.
  // component.getinitialprops를 실행하고
  // hastag.js의 getinitialprops가 tag값을 리턴하면,
  // 그 리턴한 값을 getprops에 담아서, component 태그에 props로 넣어주면
  //hashtag.js에서 {tag}로 사용
  let pageProps = {};
  const state = ctx.store.getState(); // store state 가져오기
  const cookie = ctx.isServer ? ctx.req.headers.cookie : ""; // 서버에서 getinit할때 브라우저없이 쿠키보내주기위해 쿠기 가져옴
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie; // axios defaults에 쿠키 심어놓기
  }
  if (!state.user.me) {
    // 내정보 없을시 가져오기
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST
    });
  }
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx); // Component들중에 getInitial이있으면 실행해줌
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
  return store; // 위로 6줄은 대부분 프로젝트에서 바뀔일이없는 코드. 배열안에 미들웨어들만 넣어주면 된다.
};

export default withRedux(configureStore)(withReduxSaga(ReactSns));
