import React, {Component} from 'react';
import Home from './Home';

export default class extends Home {
  render() {
    return <Home section="missions" {...this.props}/>;
  }
}
