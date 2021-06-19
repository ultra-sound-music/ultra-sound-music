import React  from 'react';
import PropTypes from 'prop-types';
import BSButton from 'react-bootstrap/Button';

export default function Button(props) {
  return <BSButton {...props}>{props.children}</BSButton>;
}

Button.propTypes = {
  children: PropTypes.node
};
