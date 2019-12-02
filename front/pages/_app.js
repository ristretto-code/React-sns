import React from "react";
import Head from "next/head";
import propTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "../reducers";
import AppLayout from "../components/AppLayout";
import rootSaga from "../sagas";

const ReactSns = ({ Component, store, pageProps }) => (
  <Provider store={store}>
    <Head>
      <title>React Sns</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.23.6/antd.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
    </Head>
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
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx); // Component들중에 getInitial이있으면 실행해줌
  }
  console.log("pageProps");
  console.log(pageProps);
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
  sagaMiddleware.run(rootSaga);
  return store; // 위로 6줄은 대부분 프로젝트에서 바뀔일이없는 코드. 배열안에 미들웨어들만 넣어주면 된다.
};

export default withRedux(configureStore)(ReactSns);
