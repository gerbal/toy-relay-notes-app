import NoteItem from './NoteItem';

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
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
});

class NoteList extends React.Component {
  renderNotes() {
    return this.props.viewer.notes.edges.map(edge =>
      <NoteItem
        key={edge.node.id}
        note={edge.node}
        viewer={this.props.viewer}
      />
    );
  }
  render() {
    return (
      <div className={css(styles.chatList)}>
        <div className={css(styles.chatListScoll)}>
          {this.renderNotes()}
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(NoteList, {
  viewer: graphql`
    fragment NoteList_viewer on User {
      notes(
        first: 2147483647 # max GraphQLInt
      ) @connection(key: "NoteList_notes") {
        edges {
          node {
            id
            ...NoteItem_note
          }
        }
      }
      id
      ...NoteItem_viewer
    }
  `,
});
