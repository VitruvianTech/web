import React, {Component} from 'react';
import Home from './Home';

export default class extends Home {
  render() {
    return <Home section="plans" {...this.props} hide/>;
  }
}
