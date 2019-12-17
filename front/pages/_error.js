import React from "react";
import propTypes from "prop-types";

const ErrorPage = ({ statusCode }) => {
  return (
    <div>
      <h1>{statusCode} 에러</h1>
    </div>
  );
};

ErrorPage.propTypes = {
  statusCode: propTypes.number
};

ErrorPage.defaultProps = {
  statusCode: 400
};

ErrorPage.getInitialProps = async context => {
  const statusCode = context.res
    ? context.res.statusCode
    : context.err
    ? context.err.statusCode
    : null;
  return { statusCode };
};

export default ErrorPage;
