import React from 'react';
import NoteTextInput from '../NoteTextInput';

import { mount } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

// Todo: Put these methods in testSetup
beforeEach(() => {
  StyleSheetTestUtils.suppressStyleInjection();
});
afterEach(() => {
  return new Promise(resolve => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    return process.nextTick(resolve);
  });
});

// The only component not dependant on Relay.
it('renders correctly', async () => {
  const onSave = jest.fn();
  const wrapper = mount(<NoteTextInput onSave={onSave} />);

  expect(wrapper).toMatchSnapshot();
});

it('calls onSave when receiving a Enter keypress', async () => {
  const onSave = jest.fn();
  const wrapper = mount(<NoteTextInput onSave={onSave} />);

  wrapper.find('input').simulate('change', { target: { value: 'text' } });

  expect(wrapper).toMatchSnapshot();
  wrapper.find('input').simulate('keyDown', { keyCode: 13 });
  expect(onSave).toHaveBeenCalled();
  expect(wrapper).toMatchSnapshot();
});

it('calls onSave onBlur', async () => {
  const onSave = jest.fn();
  const wrapper = mount(<NoteTextInput onSave={onSave} commitOnBlur />);

  wrapper.find('input').simulate('change', { target: { value: 'blur' } });

  expect(wrapper).toMatchSnapshot();
  wrapper.find('input').simulate('blur');
  expect(onSave).toHaveBeenCalled();
  expect(wrapper).toMatchSnapshot();
});
