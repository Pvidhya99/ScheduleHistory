import React, { useContext } from 'react';
import PropTypes from 'prop-types';



import AppContext from '../../context/Context';


const CodeHighlight = ({ code, language }) => {
  const { isDark } = useContext(AppContext);
  return (
    <></>
  );
};
CodeHighlight.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string
};

CodeHighlight.defaultProps = { language: 'html' };

export default CodeHighlight;
