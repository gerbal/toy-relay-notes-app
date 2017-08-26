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
  chatBox: {
    position: 'fixed',
    bottom: '0',
    right: '0',
    maxWidth: '20rem',
    width: '100vw',
    borderStyle: 'solid',
    height: '100vh',
    maxHeight: '25rem',
    display: 'flex',
    flexDirection: 'column',
    padding: '0.4rem',
    overflow: 'auto',
  },

  itemCounter: {
    top: 0,
    position: 'relative',
    flex: '0 1 auto',
    paddingLeft: '0.2rem',
    backgroundColor: 'grey',
  },
  chatList: {
    marginTop: '0.4rem',
    flex: '1 1 auto',

    overflowY: 'scroll',
  },
  chatListScoll: {
    minHeight: 'min-content',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  chatItemWrapper: {
    display: 'inline-flex',
    padding: '0.2rem',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  chatTextWrapper: {
    flex: ' 1 2 auto',
    backgroundColor: 'gainsboro',
    marginLeft: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '0px',
  },
  chatTextWrapperArrow: {
    marginLeft: '-10px',
    width: '0',
    height: '0',
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '10px solid gainsboro',
  },
  chatItemRow: {
    display: 'inline-flex',
    flexDirection: 'row',
    flex: '1 0 100%',
  },
  chatItemText: {
    flex: '1 1 100%',
    width: '100%',
    marginLeft: '0.5rem',
    padding: '0.2rem',
    display: 'flex',
    alignItems: 'stretch'
  },
  chatItemTextText: {
    flex: '1',
  },
  chatItemTimestamp: {
    marginLeft: 'auto',
    fontSize: '10px'
  },
  chatAvatar: {
    borderRadius: '50%',
    backgroundColor: 'gainsboro',
    textTransform: 'uppercase',
    padding: '0.4rem',
    flex: '0 0 auto',
    width: '1.3rem',
    height: '1.3rem',
    lineHeight: '1.3rem',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  chatInput: {
    marginTop: '0.5rem',
    maxWidth: '100%',
  },
  textInput: {
    width: '100%',
    boxSizing: 'border-box',
  },
  iconButton: {
    float: 'right',
    position: 'relative',
    lineHeight: '20px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  button: {
    flex: '0',
    margin: 'auto 0.3rem',
    alignSelf: 'flex-end',
    fontSize: '1rem',
    textDecoration: 'none'
  },
  cancel: {
    width: '1rem',
    height: '1rem'
  },
  edit: {
    width: '1rem',
    height: '1rem',
    background: 'url:'
  },
});

const IconButton = ({ text, onClick, className }) => {
  return (
    <div className={className} >
      <button className={css(styles.iconButton)} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

const ChatItem = ({ text }) => {
  return (
    <div className={css(styles.chatItemWrapper)}>
      <div className={css(styles.chatItemRow)}>
        <div className={css(styles.chatAvatar)}>GM</div>
        <div className={css(styles.chatTextWrapper)}>
          <div className={css(styles.chatTextWrapperArrow)} />
          <div className={css(styles.chatItemText)}>
            <span className={css(styles.chatItemTextText)} >{text.text}</span>
            <IconButton text="🖉" className={css(styles.button, styles.edit)} />
            <IconButton text="🗙" className={css(styles.button, styles.cancel)} />
          </div>
        </div>
      </div>
      <div className={css(styles.chatItemRow)}>
        <div className={css(styles.chatItemTimestamp)}>
          {text.timestamp}
        </div>
      </div>
    </div>
  );
};

class TodoApp extends React.Component {
  _handleTextInputSave = text => {
    AddTodoMutation.commit(
      this.props.relay.environment,
      text,
      this.props.viewer
    );
  };

  render() {
    const texts = [
      {
        text: 'a short message',
        timestamp: 'Earlier',
      },
      {
        text: 'a longer message with some more characters',
        timestamp: 'Earlier',
      },
      {
        text:
          'A very long message that just keeps going and going and going and going and going',
        timestamp: 'Recently',
      },
      {
        text: 'A message with a newline in it \n see there it is',
        timestamp: 'nowish',
      },
      {
        text: 'More messages',
        timestamp: new Date().toLocaleString("en-gb"),
      },
      {
        text: 'What happens when we need to scroll?',
        timestamp: 'nowish',
      },
    ];
    const hasTodos = this.props.viewer.totalCount > 0;
    return (
      <div className={css(styles.chatBox)}>
        <div className={css(styles.itemCounter)}>4 Items</div>
        <div className={css(styles.chatList)}>
          <div className={css(styles.chatListScoll)}>
            {texts.map(txt => <ChatItem text={txt} />)}
          </div>
        </div>
        <div className={css(styles.chatInput)}>
          <input className={css(styles.textInput)} />
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
