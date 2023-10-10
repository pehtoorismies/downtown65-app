/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}\n\nmutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    tokens {\n      accessToken\n      idToken\n      refreshToken\n    }\n    loginError {\n      message\n      path\n      code\n    }\n  }\n}\n\nmutation Signup($name: String!, $email: String!, $password: String!, $nickname: String!, $registerSecret: String!) {\n  signup(\n    input: {name: $name, email: $email, password: $password, nickname: $nickname, registerSecret: $registerSecret}\n  ) {\n    user {\n      id\n    }\n    errors {\n      path\n      message\n    }\n  }\n}\n\nmutation RefreshToken($refreshToken: String!) {\n  refreshToken(refreshToken: $refreshToken) {\n    tokens {\n      idToken\n      accessToken\n    }\n    refreshError\n  }\n}": types.ForgotPasswordDocument,
    "fragment baseFields on Event {\n  id\n  createdBy {\n    id\n    nickname\n    picture\n  }\n  dateStart\n  description\n  location\n  participants {\n    id\n    joinedAt\n    nickname\n    picture\n  }\n  race\n  subtitle\n  title\n  timeStart\n  type\n}\n\nquery GetEvent($eventId: ID!) {\n  event(eventId: $eventId) {\n    ...baseFields\n  }\n}\n\nquery GetEvents {\n  events {\n    ...baseFields\n  }\n}\n\nmutation CreateEvent($input: CreateEventInput!) {\n  createEvent(input: $input) {\n    id\n  }\n}\n\nmutation ParticipateEvent($eventId: ID!, $me: MeInput!) {\n  participateEvent(eventId: $eventId, me: $me)\n}\n\nmutation LeaveEvent($eventId: ID!) {\n  leaveEvent(eventId: $eventId)\n}\n\nmutation DeleteEvent($eventId: ID!) {\n  deleteEvent(eventId: $eventId) {\n    id\n  }\n}\n\nmutation UpdateEvent($eventId: ID!, $input: UpdateEventInput!) {\n  updateEvent(eventId: $eventId, input: $input) {\n    id\n  }\n}": types.BaseFieldsFragmentDoc,
    "query GetUsers($perPage: Int!, $page: Int!) {\n  users(page: $page, perPage: $perPage) {\n    users {\n      id\n      name\n      nickname\n    }\n    length\n    limit\n    start\n    total\n  }\n}\n\nquery GetUserByNick($nickname: String!) {\n  user(nickname: $nickname) {\n    id\n    name\n    nickname\n    email\n    picture\n    createdAt\n  }\n}": types.GetUsersDocument,
    "query GetProfile {\n  me {\n    id\n    email\n    name\n    nickname\n    picture\n    preferences {\n      subscribeEventCreationEmail\n      subscribeWeeklyEmail\n    }\n  }\n}\n\nmutation UpdateMe($subscribeWeeklyEmail: Boolean!, $subscribeEventCreationEmail: Boolean!) {\n  updateMe(\n    input: {preferences: {subscribeWeeklyEmail: $subscribeWeeklyEmail, subscribeEventCreationEmail: $subscribeEventCreationEmail}}\n  ) {\n    id\n    nickname\n    name\n    preferences {\n      subscribeWeeklyEmail\n      subscribeEventCreationEmail\n    }\n  }\n}\n\nmutation UpdateAvatar($uploadedFilename: String!) {\n  updateAvatar(uploadedFilename: $uploadedFilename)\n}": types.GetProfileDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}\n\nmutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    tokens {\n      accessToken\n      idToken\n      refreshToken\n    }\n    loginError {\n      message\n      path\n      code\n    }\n  }\n}\n\nmutation Signup($name: String!, $email: String!, $password: String!, $nickname: String!, $registerSecret: String!) {\n  signup(\n    input: {name: $name, email: $email, password: $password, nickname: $nickname, registerSecret: $registerSecret}\n  ) {\n    user {\n      id\n    }\n    errors {\n      path\n      message\n    }\n  }\n}\n\nmutation RefreshToken($refreshToken: String!) {\n  refreshToken(refreshToken: $refreshToken) {\n    tokens {\n      idToken\n      accessToken\n    }\n    refreshError\n  }\n}"): (typeof documents)["mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}\n\nmutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    tokens {\n      accessToken\n      idToken\n      refreshToken\n    }\n    loginError {\n      message\n      path\n      code\n    }\n  }\n}\n\nmutation Signup($name: String!, $email: String!, $password: String!, $nickname: String!, $registerSecret: String!) {\n  signup(\n    input: {name: $name, email: $email, password: $password, nickname: $nickname, registerSecret: $registerSecret}\n  ) {\n    user {\n      id\n    }\n    errors {\n      path\n      message\n    }\n  }\n}\n\nmutation RefreshToken($refreshToken: String!) {\n  refreshToken(refreshToken: $refreshToken) {\n    tokens {\n      idToken\n      accessToken\n    }\n    refreshError\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment baseFields on Event {\n  id\n  createdBy {\n    id\n    nickname\n    picture\n  }\n  dateStart\n  description\n  location\n  participants {\n    id\n    joinedAt\n    nickname\n    picture\n  }\n  race\n  subtitle\n  title\n  timeStart\n  type\n}\n\nquery GetEvent($eventId: ID!) {\n  event(eventId: $eventId) {\n    ...baseFields\n  }\n}\n\nquery GetEvents {\n  events {\n    ...baseFields\n  }\n}\n\nmutation CreateEvent($input: CreateEventInput!) {\n  createEvent(input: $input) {\n    id\n  }\n}\n\nmutation ParticipateEvent($eventId: ID!, $me: MeInput!) {\n  participateEvent(eventId: $eventId, me: $me)\n}\n\nmutation LeaveEvent($eventId: ID!) {\n  leaveEvent(eventId: $eventId)\n}\n\nmutation DeleteEvent($eventId: ID!) {\n  deleteEvent(eventId: $eventId) {\n    id\n  }\n}\n\nmutation UpdateEvent($eventId: ID!, $input: UpdateEventInput!) {\n  updateEvent(eventId: $eventId, input: $input) {\n    id\n  }\n}"): (typeof documents)["fragment baseFields on Event {\n  id\n  createdBy {\n    id\n    nickname\n    picture\n  }\n  dateStart\n  description\n  location\n  participants {\n    id\n    joinedAt\n    nickname\n    picture\n  }\n  race\n  subtitle\n  title\n  timeStart\n  type\n}\n\nquery GetEvent($eventId: ID!) {\n  event(eventId: $eventId) {\n    ...baseFields\n  }\n}\n\nquery GetEvents {\n  events {\n    ...baseFields\n  }\n}\n\nmutation CreateEvent($input: CreateEventInput!) {\n  createEvent(input: $input) {\n    id\n  }\n}\n\nmutation ParticipateEvent($eventId: ID!, $me: MeInput!) {\n  participateEvent(eventId: $eventId, me: $me)\n}\n\nmutation LeaveEvent($eventId: ID!) {\n  leaveEvent(eventId: $eventId)\n}\n\nmutation DeleteEvent($eventId: ID!) {\n  deleteEvent(eventId: $eventId) {\n    id\n  }\n}\n\nmutation UpdateEvent($eventId: ID!, $input: UpdateEventInput!) {\n  updateEvent(eventId: $eventId, input: $input) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUsers($perPage: Int!, $page: Int!) {\n  users(page: $page, perPage: $perPage) {\n    users {\n      id\n      name\n      nickname\n    }\n    length\n    limit\n    start\n    total\n  }\n}\n\nquery GetUserByNick($nickname: String!) {\n  user(nickname: $nickname) {\n    id\n    name\n    nickname\n    email\n    picture\n    createdAt\n  }\n}"): (typeof documents)["query GetUsers($perPage: Int!, $page: Int!) {\n  users(page: $page, perPage: $perPage) {\n    users {\n      id\n      name\n      nickname\n    }\n    length\n    limit\n    start\n    total\n  }\n}\n\nquery GetUserByNick($nickname: String!) {\n  user(nickname: $nickname) {\n    id\n    name\n    nickname\n    email\n    picture\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProfile {\n  me {\n    id\n    email\n    name\n    nickname\n    picture\n    preferences {\n      subscribeEventCreationEmail\n      subscribeWeeklyEmail\n    }\n  }\n}\n\nmutation UpdateMe($subscribeWeeklyEmail: Boolean!, $subscribeEventCreationEmail: Boolean!) {\n  updateMe(\n    input: {preferences: {subscribeWeeklyEmail: $subscribeWeeklyEmail, subscribeEventCreationEmail: $subscribeEventCreationEmail}}\n  ) {\n    id\n    nickname\n    name\n    preferences {\n      subscribeWeeklyEmail\n      subscribeEventCreationEmail\n    }\n  }\n}\n\nmutation UpdateAvatar($uploadedFilename: String!) {\n  updateAvatar(uploadedFilename: $uploadedFilename)\n}"): (typeof documents)["query GetProfile {\n  me {\n    id\n    email\n    name\n    nickname\n    picture\n    preferences {\n      subscribeEventCreationEmail\n      subscribeWeeklyEmail\n    }\n  }\n}\n\nmutation UpdateMe($subscribeWeeklyEmail: Boolean!, $subscribeEventCreationEmail: Boolean!) {\n  updateMe(\n    input: {preferences: {subscribeWeeklyEmail: $subscribeWeeklyEmail, subscribeEventCreationEmail: $subscribeEventCreationEmail}}\n  ) {\n    id\n    nickname\n    name\n    preferences {\n      subscribeWeeklyEmail\n      subscribeEventCreationEmail\n    }\n  }\n}\n\nmutation UpdateAvatar($uploadedFilename: String!) {\n  updateAvatar(uploadedFilename: $uploadedFilename)\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;