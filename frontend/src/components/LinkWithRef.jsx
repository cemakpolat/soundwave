// src/components/LinkWithRef.jsx
import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const LinkWithRef = forwardRef((props, ref) => {
  return <Link {...props} ref={ref} />;
});

export default LinkWithRef;