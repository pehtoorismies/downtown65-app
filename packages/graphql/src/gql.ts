/* eslint-disable */
import * as types from './graphql'
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

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
  '\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n':
    types.ForgotPasswordDocument,
  '\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      __typename\n      ...TokensFragment\n      ...ErrorFragment\n    }\n  }\n  fragment TokensFragment on Tokens {\n    accessToken\n    idToken\n    refreshToken\n  }\n  fragment ErrorFragment on LoginError {\n    message\n    statusCode\n    error\n  }\n':
    types.LoginDocument,
  '\n  mutation Signup(\n    $name: String!\n    $email: String!\n    $password: String!\n    $nickname: String!\n    $registerSecret: String!\n  ) {\n    signup(\n      input: {\n        name: $name\n        email: $email\n        password: $password\n        nickname: $nickname\n        registerSecret: $registerSecret\n      }\n    ) {\n      __typename\n      ...SignupSuccessFragment\n      ...SignupErrorFragment\n    }\n  }\n  fragment SignupSuccessFragment on SignupSuccess {\n    message\n  }\n  fragment SignupErrorFragment on SignupError {\n    errors {\n      message\n      path\n    }\n  }\n':
    types.SignupDocument,
  '\n  query GetEvent($eventId: ID!) {\n    event(eventId: $eventId) {\n      id\n      createdBy {\n        id\n        nickname\n        picture\n      }\n      dateStart\n      description\n      location\n      participants {\n        id\n        joinedAt\n        nickname\n        picture\n      }\n      race\n      subtitle\n      title\n      timeStart\n      type\n    }\n  }\n  mutation ParticipateEvent($eventId: ID!, $me: MeInput!) {\n    participateEvent(eventId: $eventId, me: $me)\n  }\n  mutation LeaveEvent($eventId: ID!) {\n    leaveEvent(eventId: $eventId)\n  }\n  mutation DeleteEvent($eventId: ID!) {\n    deleteEvent(eventId: $eventId) {\n      id\n    }\n  }\n':
    types.GetEventDocument,
  '\n  query GetEvents {\n    events {\n      id\n      createdBy {\n        id\n        nickname\n        picture\n      }\n      dateStart\n      description\n      location\n      participants {\n        id\n        joinedAt\n        nickname\n        picture\n      }\n      race\n      subtitle\n      title\n      timeStart\n      type\n    }\n  }\n':
    types.GetEventsDocument,
  '\n  mutation UpdateEvent($eventId: ID!, $input: UpdateEventInput!) {\n    updateEvent(eventId: $eventId, input: $input) {\n      id\n    }\n  }\n':
    types.UpdateEventDocument,
  '\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      id\n    }\n  }\n':
    types.CreateEventDocument,
  '\n  query GetUserByNick($nickname: String!) {\n    user(nickname: $nickname) {\n      id\n      name\n      nickname\n      email\n      picture\n      createdAt\n    }\n  }\n':
    types.GetUserByNickDocument,
  '\n  query GetUsers($perPage: Int!, $page: Int!) {\n    users(page: $page, perPage: $perPage) {\n      users {\n        id\n        name\n        nickname\n      }\n      length\n      limit\n      start\n      total\n    }\n  }\n':
    types.GetUsersDocument,
  '\n  query GetProfile {\n    me {\n      id\n      email\n      name\n      nickname\n      picture\n      preferences {\n        subscribeEventCreationEmail\n        subscribeWeeklyEmail\n      }\n    }\n  }\n  mutation UpdateMe(\n    $subscribeWeeklyEmail: Boolean!\n    $subscribeEventCreationEmail: Boolean!\n  ) {\n    updateMe(\n      input: {\n        preferences: {\n          subscribeWeeklyEmail: $subscribeWeeklyEmail\n          subscribeEventCreationEmail: $subscribeEventCreationEmail\n        }\n      }\n    ) {\n      id\n      nickname\n      name\n      preferences {\n        subscribeWeeklyEmail\n        subscribeEventCreationEmail\n      }\n    }\n  }\n':
    types.GetProfileDocument,
  '\n  mutation UpdateAvatar($uploadedFilename: String!) {\n    updateAvatar(uploadedFilename: $uploadedFilename)\n  }\n':
    types.UpdateAvatarDocument,
  '\n  mutation RefreshToken($refreshToken: String!) {\n    refreshToken(refreshToken: $refreshToken) {\n      __typename\n      ...RefreshTokensFragment\n      ...RefreshErrorFragment\n    }\n  }\n  fragment RefreshTokensFragment on RefreshTokens {\n    accessToken\n    idToken\n  }\n  fragment RefreshErrorFragment on RefreshError {\n    message\n  }\n':
    types.RefreshTokenDocument,
}

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
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n'
): (typeof documents)['\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(email: $email)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      __typename\n      ...TokensFragment\n      ...ErrorFragment\n    }\n  }\n  fragment TokensFragment on Tokens {\n    accessToken\n    idToken\n    refreshToken\n  }\n  fragment ErrorFragment on LoginError {\n    message\n    statusCode\n    error\n  }\n'
): (typeof documents)['\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      __typename\n      ...TokensFragment\n      ...ErrorFragment\n    }\n  }\n  fragment TokensFragment on Tokens {\n    accessToken\n    idToken\n    refreshToken\n  }\n  fragment ErrorFragment on LoginError {\n    message\n    statusCode\n    error\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Signup(\n    $name: String!\n    $email: String!\n    $password: String!\n    $nickname: String!\n    $registerSecret: String!\n  ) {\n    signup(\n      input: {\n        name: $name\n        email: $email\n        password: $password\n        nickname: $nickname\n        registerSecret: $registerSecret\n      }\n    ) {\n      __typename\n      ...SignupSuccessFragment\n      ...SignupErrorFragment\n    }\n  }\n  fragment SignupSuccessFragment on SignupSuccess {\n    message\n  }\n  fragment SignupErrorFragment on SignupError {\n    errors {\n      message\n      path\n    }\n  }\n'
): (typeof documents)['\n  mutation Signup(\n    $name: String!\n    $email: String!\n    $password: String!\n    $nickname: String!\n    $registerSecret: String!\n  ) {\n    signup(\n      input: {\n        name: $name\n        email: $email\n        password: $password\n        nickname: $nickname\n        registerSecret: $registerSecret\n      }\n    ) {\n      __typename\n      ...SignupSuccessFragment\n      ...SignupErrorFragment\n    }\n  }\n  fragment SignupSuccessFragment on SignupSuccess {\n    message\n  }\n  fragment SignupErrorFragment on SignupError {\n    errors {\n      message\n      path\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEvent($eventId: ID!) {\n    event(eventId: $eventId) {\n      id\n      createdBy {\n        id\n        nickname\n        picture\n      }\n      dateStart\n      description\n      location\n      participants {\n        id\n        joinedAt\n        nickname\n        picture\n      }\n      race\n      subtitle\n      title\n      timeStart\n      type\n    }\n  }\n  mutation ParticipateEvent($eventId: ID!, $me: MeInput!) {\n    participateEvent(eventId: $eventId, me: $me)\n  }\n  mutation LeaveEvent($eventId: ID!) {\n    leaveEvent(eventId: $eventId)\n  }\n  mutation DeleteEvent($eventId: ID!) {\n    deleteEvent(eventId: $eventId) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  query GetEvent($eventId: ID!) {\n    event(eventId: $eventId) {\n      id\n      createdBy {\n        id\n        nickname\n        picture\n      }\n      dateStart\n      description\n      location\n      participants {\n        id\n        joinedAt\n        nickname\n        picture\n      }\n      race\n      subtitle\n      title\n      timeStart\n      type\n    }\n  }\n  mutation ParticipateEvent($eventId: ID!, $me: MeInput!) {\n    participateEvent(eventId: $eventId, me: $me)\n  }\n  mutation LeaveEvent($eventId: ID!) {\n    leaveEvent(eventId: $eventId)\n  }\n  mutation DeleteEvent($eventId: ID!) {\n    deleteEvent(eventId: $eventId) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEvents {\n    events {\n      id\n      createdBy {\n        id\n        nickname\n        picture\n      }\n      dateStart\n      description\n      location\n      participants {\n        id\n        joinedAt\n        nickname\n        picture\n      }\n      race\n      subtitle\n      title\n      timeStart\n      type\n    }\n  }\n'
): (typeof documents)['\n  query GetEvents {\n    events {\n      id\n      createdBy {\n        id\n        nickname\n        picture\n      }\n      dateStart\n      description\n      location\n      participants {\n        id\n        joinedAt\n        nickname\n        picture\n      }\n      race\n      subtitle\n      title\n      timeStart\n      type\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateEvent($eventId: ID!, $input: UpdateEventInput!) {\n    updateEvent(eventId: $eventId, input: $input) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateEvent($eventId: ID!, $input: UpdateEventInput!) {\n    updateEvent(eventId: $eventId, input: $input) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetUserByNick($nickname: String!) {\n    user(nickname: $nickname) {\n      id\n      name\n      nickname\n      email\n      picture\n      createdAt\n    }\n  }\n'
): (typeof documents)['\n  query GetUserByNick($nickname: String!) {\n    user(nickname: $nickname) {\n      id\n      name\n      nickname\n      email\n      picture\n      createdAt\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetUsers($perPage: Int!, $page: Int!) {\n    users(page: $page, perPage: $perPage) {\n      users {\n        id\n        name\n        nickname\n      }\n      length\n      limit\n      start\n      total\n    }\n  }\n'
): (typeof documents)['\n  query GetUsers($perPage: Int!, $page: Int!) {\n    users(page: $page, perPage: $perPage) {\n      users {\n        id\n        name\n        nickname\n      }\n      length\n      limit\n      start\n      total\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetProfile {\n    me {\n      id\n      email\n      name\n      nickname\n      picture\n      preferences {\n        subscribeEventCreationEmail\n        subscribeWeeklyEmail\n      }\n    }\n  }\n  mutation UpdateMe(\n    $subscribeWeeklyEmail: Boolean!\n    $subscribeEventCreationEmail: Boolean!\n  ) {\n    updateMe(\n      input: {\n        preferences: {\n          subscribeWeeklyEmail: $subscribeWeeklyEmail\n          subscribeEventCreationEmail: $subscribeEventCreationEmail\n        }\n      }\n    ) {\n      id\n      nickname\n      name\n      preferences {\n        subscribeWeeklyEmail\n        subscribeEventCreationEmail\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetProfile {\n    me {\n      id\n      email\n      name\n      nickname\n      picture\n      preferences {\n        subscribeEventCreationEmail\n        subscribeWeeklyEmail\n      }\n    }\n  }\n  mutation UpdateMe(\n    $subscribeWeeklyEmail: Boolean!\n    $subscribeEventCreationEmail: Boolean!\n  ) {\n    updateMe(\n      input: {\n        preferences: {\n          subscribeWeeklyEmail: $subscribeWeeklyEmail\n          subscribeEventCreationEmail: $subscribeEventCreationEmail\n        }\n      }\n    ) {\n      id\n      nickname\n      name\n      preferences {\n        subscribeWeeklyEmail\n        subscribeEventCreationEmail\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateAvatar($uploadedFilename: String!) {\n    updateAvatar(uploadedFilename: $uploadedFilename)\n  }\n'
): (typeof documents)['\n  mutation UpdateAvatar($uploadedFilename: String!) {\n    updateAvatar(uploadedFilename: $uploadedFilename)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RefreshToken($refreshToken: String!) {\n    refreshToken(refreshToken: $refreshToken) {\n      __typename\n      ...RefreshTokensFragment\n      ...RefreshErrorFragment\n    }\n  }\n  fragment RefreshTokensFragment on RefreshTokens {\n    accessToken\n    idToken\n  }\n  fragment RefreshErrorFragment on RefreshError {\n    message\n  }\n'
): (typeof documents)['\n  mutation RefreshToken($refreshToken: String!) {\n    refreshToken(refreshToken: $refreshToken) {\n      __typename\n      ...RefreshTokensFragment\n      ...RefreshErrorFragment\n    }\n  }\n  fragment RefreshTokensFragment on RefreshTokens {\n    accessToken\n    idToken\n  }\n  fragment RefreshErrorFragment on RefreshError {\n    message\n  }\n']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
