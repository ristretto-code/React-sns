import React from "react";
import Head from "next/head";
import propTypes from "prop-types";
import AppLayout from "../components/AppLayout";

const ReactSns = ({ Component }) => {
  return (
    <>
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
    </>
  );
};

ReactSns.propTypes = {
  Component: propTypes.elementType // 모든 자료형을 포함하는 node
};

export default ReactSns;
