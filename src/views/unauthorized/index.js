import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import './index.scss';

const propTypes = {
  intl: PropTypes.object.isRequired,
};

class Unauthorized extends Component {
  render() {
    const { intl } = this.props;

    return (
      <div className="view-unauthorized">
        <div className="view-unauthorized-errorCode">
          403
        </div>
        <div className="view-unauthorized-errorDesc">
         11
        </div>
        <Link to="/" href="/">
          <Button type="primary">
           11
          </Button>
        </Link>
      </div>
    );
  }
}

Unauthorized.propTypes = propTypes;
export default Unauthorized;
