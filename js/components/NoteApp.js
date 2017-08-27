import AddNoteMutation from '../mutations/AddNoteMutation';
import NoteList from './NoteList';
import NoteTextInput from './NoteTextInput';

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
    // top: 0,
    // position: 'relative',
    flex: '0 1 auto',
    paddingLeft: '0.2rem',
    backgroundColor: 'grey',
    alignSelf: 'flex-start'
  }
});

class NoteApp extends React.Component {
  _handleTextInputSave = text => {
    AddNoteMutation.commit(
      this.props.relay.environment,
      text,
      this.props.viewer
    );
  };

  render() {
    return (
      <div className={css(styles.chatBox)}>
        <div className={css(styles.itemCounter)}>{`${this.props.viewer
          .totalCount} Items`}</div>
        <NoteList viewer={this.props.viewer} />
        <NoteTextInput
          autoFocus={true}
          onSave={this._handleTextInputSave}
          placeholder="What needs to be done?"
        />
      </div>
    );
  }
}

export default createFragmentContainer(NoteApp, {
  viewer: graphql`
    fragment NoteApp_viewer on User {
      id
      totalCount
      ...NoteList_viewer
    }
  `,
});
