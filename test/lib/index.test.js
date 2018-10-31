// @flow

import React from 'react';
import { shallow } from 'enzyme';
import HoneybadgerReact, { formatComponentStack } from '../../src/lib/index.js';

const hb = {
  notify: jest.fn(),
  setContext: jest.fn(),
  beforeNotify: jest.fn(),
};

it('should format a component stack correctly', () => {
  const formatted = formatComponentStack(`\n\n\n\nError \n
    at generateStackTrace (inject.js:6346:13) \n
    at Object.self.notify (inject.js:6652:26) \n
    at handleNewError (inject.js:10540:27) \n
    at HTMLDocument.<anonymous> (inject.js:10560:5) \n
    at HTMLDocument.fn.___hb (inject.js:6615:25)`);

  const expected = `Error
at generateStackTrace (inject.js:6346:13)
at Object.self.notify (inject.js:6652:26)
at handleNewError (inject.js:10540:27)
at HTMLDocument.<anonymous> (inject.js:10560:5)
at HTMLDocument.fn.___hb (inject.js:6615:25)`;
  expect(formatted).toEqual(expected);
});

it('should render with no errors', () => {
  const wrapper = shallow(
    <HoneybadgerReact client={hb}>
      <div>No error!</div>
    </HoneybadgerReact>,
  );
  expect(wrapper.is('div')).toBe(true);
  expect(wrapper.prop('children')).toEqual('No error!');
});

const ProblemChild = () => <div>{some.nonexistant.property}</div>; //eslint-disable-line

it('should render an fallback component when there is an error', () => {
  const Fallback = () => <aside>Something went wrong!</aside>;
  const wrapper = shallow(
    <HoneybadgerReact client={hb} FallbackComponent={Fallback}>
      <ProblemChild />
    </HoneybadgerReact>,
  );
  wrapper.setState({ error: new Error('test') });
  wrapper.update();
  expect(wrapper.find(Fallback)).toHaveLength(1);
  expect(wrapper.html()).toEqual('<aside>Something went wrong!</aside>');
});
