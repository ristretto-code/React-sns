import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import reducer from "../reducers";
import propTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";

const ReactSns = ({ Component, store }) => {
  return (
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
};

ReactSns.propTypes = {
  Component: propTypes.elementType, // 모든 자료형을 포함하는 node
  store: propTypes.object
};

export default withRedux((initialState, options) => {
  const middlewares = [];
  const enhancer = compose(
    applyMiddleware(...middlewares),
    typeof window !== "undefined" &&
      window.__REDUX_DEVTOOLS_EXTENTION__ !== "undefined"
      ? window.__REDUX_DEVTOOLS_EXTENTION__()
      : f => f
  );
  const store = createStore(reducer, initialState, enhancer);
  return store; // 위로 4줄은 대부분 프로젝트에서 바뀔일이없는 코드. 배열안에 미들웨어들만 넣어주면 된다.
})(ReactSns);
