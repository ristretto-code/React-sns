import React from "react";
import PropTypes from "prop-types";

const User = ({ id }) => {
  return <div>User</div>;
};

User.prototypes = {
  id: PropTypes.number.isRequired
};

User.getInitialProps = async context => {
  console.log("User getInitialProps", context.query.id);
  return { id: parseInt(context.query.id, 10) };
};

export default User;
