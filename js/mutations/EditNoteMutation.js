import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation EditNoteMutation($input: EditNoteInput!) {
    editNote(input:$input) {
      note {
        id
        text
      }
    }
  }
`;

function getOptimisticResponse(text, note) {
  return {
    editNote: {
      note: {
        id: note.id,
        text: text,
      },
    },
  };
}

function commit(
  environment,
  text,
  note
) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {text, id: note.id},
      },
      optimisticResponse: getOptimisticResponse(text, note),
    }
  );
}

export default {commit};
