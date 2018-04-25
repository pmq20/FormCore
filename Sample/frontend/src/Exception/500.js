import React from 'react';
import { Link } from 'react-router-dom';
import Exception from './index.js';

export default () => (
  <Exception type="500" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
);
