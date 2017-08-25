/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import AddTodoMutation from '../mutations/AddTodoMutation';
import TodoList from './TodoList';
import TodoListFooter from './TodoListFooter';
import TodoTextInput from './TodoTextInput';

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  red: {
    backgroundColor: 'red',
  },

  blue: {
    backgroundColor: 'blue',
  },

  hover: {
    ':hover': {
        backgroundColor: 'red',
      },
  },

  small: {
    '@media (max-width: 600px)': {
        backgroundColor: 'red',
      },
  },
});

class TodoApp extends React.Component {
  _handleTextInputSave = text => {
    AddTodoMutation.commit(
      this.props.relay.environment,
      text,
      this.props.viewer
    );
  };
  render() {
    const hasTodos = this.props.viewer.totalCount > 0;
    return (
      <div>
      <div>
      <span className={css(styles.red)}>
          This is red.
      </span>
      <span className={css(styles.hover)}>
          This turns red on hover.
      </span>
      <span className={css(styles.small)}>
          This turns red when the browser is less than 600px width.
      </span>
      <span className={css(styles.red, styles.blue)}>
          This is blue.
      </span>
      <span className={css(styles.blue, styles.small)}>
          This is blue and turns red when the browser is less than
          600px width.
      </span>
  </div>
      </div>
    );
  }
}

export default createFragmentContainer(TodoApp, {
  viewer: graphql`
    fragment TodoApp_viewer on User {
      id
      totalCount
      ...TodoListFooter_viewer
      ...TodoList_viewer
    }
  `,
});
