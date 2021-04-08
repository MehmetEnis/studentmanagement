import React from "react";
import { withRouter } from "react-router-dom";

const Header = props => {
  const capitalise = s => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  const segments = props.location.pathname.split('/');
  const path = capitalise(segments[1]);
  return (
    <div>
      <h1>{path}</h1>
    </div>
  );
};

export default withRouter(Header);