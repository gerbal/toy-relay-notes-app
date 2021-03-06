import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

const styles = StyleSheet.create({
  chatInput: {
    marginTop: '0.5rem',
    maxWidth: '100%',
  },
  textInput: {
    width: '100%',
    boxSizing: 'border-box',
  },
});

export default class NoteTextInput extends React.Component {
  static defaultProps = {
    commitOnBlur: false,
  };
  static propTypes = {
    className: PropTypes.string,
    commitOnBlur: PropTypes.bool.isRequired,
    initialValue: PropTypes.string,
    onCancel: PropTypes.func,
    onSave: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };
  state = {
    isEditing: false,
    text: this.props.initialValue || '',
  };
  
  componentDidMount() {
    this.textInput.focus();
  }

  _commitChanges = () => {
    const newText = this.state.text.trim();
    if (this.props.onCancel && newText === this.props.initialValue) {
      this.props.onCancel();
    } else if (newText !== '') {
      this.props.onSave(newText);
      this.setState({ text: '' });
    }
  };
  _handleBlur = () => {
    if (this.props.commitOnBlur) {
      this._commitChanges();
    }
  };
  _handleChange = e => {
    this.setState({ text: e.target.value });
  };
  _handleKeyDown = e => {
    if (this.props.onCancel && e.keyCode === ESC_KEY_CODE) {
      this.props.onCancel();
    } else if (e.keyCode === ENTER_KEY_CODE) {
      this._commitChanges();
    }
  };

  render() {
    return (
      <div className={css(styles.chatInput)}>
        <input
          ref={(input) => { this.textInput = input; }}
          className={css(styles.textInput)}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
          placeholder={this.props.placeholder}
          value={this.state.text}
        />
      </div>
    );
  }
}
