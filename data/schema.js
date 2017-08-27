import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Note,
  User,
  addNote,
  getNote,
  getNotes,
  getUser,
  getViewer,
  removeNote,
  editNote,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Note') {
      return getNote(id);
    } else if (type === 'User') {
      return getUser(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Note) {
      return GraphQLNote;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

const GraphQLNote = new GraphQLObjectType({
  name: 'Note',
  fields: {
    id: globalIdField('Note'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    timestamp: {
      type: GraphQLString,
      resolve: (obj) => obj.timestamp,
    },
    userName: {
      type: GraphQLString,
      resolve: (obj) => obj.userName,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: NotesConnection,
  edgeType: GraphQLNoteEdge,
} = connectionDefinitions({
  name: 'Note',
  nodeType: GraphQLNote,
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    notes: {
      type: NotesConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, {status, ...args}) =>
        connectionFromArray(getNotes(status), args),
    },
    totalCount: {
      type: GraphQLInt,
      resolve: () => getNotes().length,
    },
  },
  interfaces: [nodeInterface],
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
    node: nodeField,
  },
});

const GraphQLAddNoteMutation = mutationWithClientMutationId({
  name: 'AddNote',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    timestamp: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    noteEdge: {
      type: GraphQLNoteEdge,
      resolve: ({localNoteId}) => {
        const note = getNote(localNoteId);
        return {
          cursor: cursorForObjectInConnection(getNotes(), note),
          node: note,
        };
      },
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({text, timestamp}) => {
    const localNoteId = addNote(text, timestamp);
    return {localNoteId};
  },
});

const GraphQLRemoveNoteMutation = mutationWithClientMutationId({
  name: 'RemoveNote',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedNoteId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localNoteId = fromGlobalId(id).id;
    removeNote(localNoteId);
    return {id};
  },
});

const GraphQLEditNoteMutation = mutationWithClientMutationId({
  name: 'EditNote',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    note: {
      type: GraphQLNote,
      resolve: ({localNoteId}) => getNote(localNoteId),
    },
  },
  mutateAndGetPayload: ({id, text}) => {
    const localNoteId = fromGlobalId(id).id;
    editNote(localNoteId, text);
    return {localNoteId};
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addNote: GraphQLAddNoteMutation,
    removeNote: GraphQLRemoveNoteMutation,
    editNote: GraphQLEditNoteMutation,
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
