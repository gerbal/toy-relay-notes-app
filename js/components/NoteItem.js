import RemoveNoteMutation from '../mutations/RemoveNoteMutation';
import EditNoteMutation from '../mutations/EditNoteMutation';
import NoteTextInput from './NoteTextInput';

import React from 'react';
import ReactDOM from 'react-dom';

import { createFragmentContainer, graphql } from 'react-relay';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  chatItemWrapper: {
    display: 'inline-flex',
    padding: '0.2rem',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  chatTextWrapper: {
    flex: '1 2 auto',
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
    alignItems: 'stretch',
  },
  chatItemTextText: {
    flex: '1',
  },
  chatItemTimestamp: {
    marginLeft: 'auto',
    fontSize: '10px',
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
    textDecoration: 'none',
  },
  cancel: {
    width: '1rem',
    height: '1rem',
  },
  edit: {
    width: '1rem',
    height: '1rem',
  },
});

const IconButton = ({ text, onClick, className }) => {
  return (
    <div className={className}>
      <button className={css(styles.iconButton)} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};


class NoteItem extends React.Component {
  state = {
    isEditing: false,
  };
  _handleDestroyClick = () => {
    this._removeNote();
  };
  _handleEditClick = () => {
    this._setEditMode(true);
  };
  _handleTextInputCancel = () => {
    this._setEditMode(false);
  };
  _handleTextInputDelete = () => {
    this._setEditMode(false);
    this._removeNote();
  };
  _handleTextInputSave = text => {
    this._setEditMode(false);
    EditNoteMutation.commit(
      this.props.relay.environment,
      text,
      this.props.note
    );
  };
  _removeNote() {
    RemoveNoteMutation.commit(
      this.props.relay.environment,
      this.props.note,
      this.props.viewer
    );
  }
  _setEditMode = shouldEdit => {
    this.setState({ isEditing: shouldEdit });
  };

  componentDidMount() {
    //   Scroll new text Items into view
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  renderTextInput() {
    return (
      <NoteTextInput
        commitOnBlur={true}
        initialValue={this.props.note.text}
        onCancel={this._handleTextInputCancel}
        onDelete={this._handleTextInputDelete}
        onSave={this._handleTextInputSave}
      />
    );
  }

  render() {
    return (
      <div className={css(styles.chatItemWrapper)}>
        <div className={css(styles.chatItemRow)}>
          <div className={css(styles.chatAvatar)}>
            {this.props.note.userName}
          </div>
          <div className={css(styles.chatTextWrapper)}>
            <div className={css(styles.chatTextWrapperArrow)} />
            <div className={css(styles.chatItemText)}>
              <span
                  className={css(styles.chatItemTextText)}
                >
                { this.state.isEditing 
                ? this.renderTextInput() 
                : this.props.note.text }
                </span>
              <IconButton
                text="🖉"
                onClick={this._handleEditClick}
                className={css(styles.button, styles.edit)}
              />
              <IconButton
                text="🗙"
                onClick={this._handleDestroyClick}
                className={css(styles.button, styles.cancel)}
              />
            </div>
          </div>
        </div>
        <div className={css(styles.chatItemRow)}>
          <div className={css(styles.chatItemTimestamp)}>
            {this.props.note.timestamp}
          </div>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(NoteItem, {
  note: graphql`
    fragment NoteItem_note on Note {
      id
      text
      timestamp
      userName
    }
  `,
  viewer: graphql`
    fragment NoteItem_viewer on User {
      id
      totalCount
    }
  `,
});
