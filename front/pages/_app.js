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

const ReactSns = ({ Component, store }) => (
  <Provider store={store}>
    <Head>
      <title>React Sns</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.23.6/antd.css"
      />
    </Head>
    <AppLayout>
      <Component />
    </AppLayout>
  </Provider>
);

ReactSns.propTypes = {
  Component: propTypes.elementType, // 모든 자료형을 포함하는 것은 node
  store: propTypes.object
};

ReactSns.getInitialProps = async context => {
  // hashtag, user에 있는 initialprops 사용하기 위해 써줘야하는 코드이다.
  //getInitialProps는 가장 먼저 시작하는 라이프싸이클이다.
  console.log("reactSns.getInitialProps에서 받은 context");
  console.log(context); // next가 기본으로 넣어준값
  const { ctx, Component } = context;
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps }; // ctx가 pageProps가 되고 전체 initialProps가 된다.
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
