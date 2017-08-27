import {
  commitMutation,
  graphql,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
  mutation RemoveNoteMutation($input: RemoveNoteInput!) {
    removeNote(input: $input) {
      deletedNoteId,
      viewer {
        totalCount,
      },
    }
  }
`;

function sharedUpdater(store, user, deletedID) {
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(
    userProxy,
    'NoteList_notes',
  );
  ConnectionHandler.deleteNode(
    conn,
    deletedID,
  );
}

function commit(
  environment,
  note,
  user,
) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {id: note.id},
      },
      updater: (store) => {
        const payload = store.getRootField('removeNote');
        sharedUpdater(store, user, payload.getValue('deletedNoteId'));
      },
      optimisticUpdater: (store) => {
        sharedUpdater(store, user, note.id);
      },
    }
  );
}

export default {commit};
