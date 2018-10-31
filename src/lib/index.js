import React, { Component } from 'react';

export const formatComponentStack = str => {
  const lines = str.split(/\s*\n\s*/g);
  let ret = '';
  for (let line = 0, len = lines.length; line < len; line += 1) {
    if (lines[line].length) ret += `${ret.length ? '\n' : ''}${lines[line]}`;
  }
  return ret;
};

class HoneybadgerReact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null,
    };
  }

  componentDidCatch(error, info) {
    const { client, beforeNotify } = this.props;
    if (beforeNotify) client.beforeNotify(beforeNotify);
    client.setContext(info);
    client.notify(error);
    this.setState({ error, info });
  }

  render() {
    const { error } = this.state;
    if (error) {
      const { FallbackComponent } = this.props;
      if (FallbackComponent)
        return React.createElement(FallbackComponent, this.state);
      return null;
    }
    return this.props.children;
  }
}

export default HoneybadgerReact;
