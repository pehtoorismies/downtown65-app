/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  AWSDate: { input: any; output: any }
}

export type AuthPayload = {
  __typename?: 'AuthPayload'
  accessToken: Scalars['String']['output']
  expiresIn: Scalars['Int']['output']
  idToken: Scalars['String']['output']
  refreshToken: Scalars['String']['output']
}

export type CreateEventInput = {
  createdBy: MeInput
  dateStart: DateInput
  description?: InputMaybe<Scalars['String']['input']>
  location: Scalars['String']['input']
  participants?: InputMaybe<Array<MeInput>>
  race: Scalars['Boolean']['input']
  subtitle: Scalars['String']['input']
  timeStart?: InputMaybe<TimeInput>
  title: Scalars['String']['input']
  type: EventType
}

export type Creator = User & {
  __typename?: 'Creator'
  id: Scalars['ID']['output']
  nickname: Scalars['String']['output']
  picture: Scalars['String']['output']
}

export type DateInput = {
  day: Scalars['Int']['input']
  month: Scalars['Int']['input']
  year: Scalars['Int']['input']
}

export type DetailedUser = {
  email: Scalars['String']['output']
  name: Scalars['String']['output']
  picture: Scalars['String']['output']
}

export type Error = {
  code: Scalars['String']['output']
  message: Scalars['String']['output']
  path: Scalars['String']['output']
}

export type Event = {
  __typename?: 'Event'
  createdBy: Creator
  dateStart: Scalars['AWSDate']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  location: Scalars['String']['output']
  participants: Array<EventParticipant>
  race: Scalars['Boolean']['output']
  subtitle: Scalars['String']['output']
  timeStart?: Maybe<Scalars['String']['output']>
  title: Scalars['String']['output']
  type: EventType
}

export type EventParticipant = User & {
  __typename?: 'EventParticipant'
  id: Scalars['ID']['output']
  joinedAt: Scalars['String']['output']
  nickname: Scalars['String']['output']
  picture: Scalars['String']['output']
}

export enum EventType {
  Cycling = 'CYCLING',
  Karonkka = 'KARONKKA',
  Meeting = 'MEETING',
  NordicWalking = 'NORDIC_WALKING',
  Orienteering = 'ORIENTEERING',
  Other = 'OTHER',
  Running = 'RUNNING',
  Skiing = 'SKIING',
  Spinning = 'SPINNING',
  Swimming = 'SWIMMING',
  TrackRunning = 'TRACK_RUNNING',
  TrailRunning = 'TRAIL_RUNNING',
  Triathlon = 'TRIATHLON',
  Ultras = 'ULTRAS',
}

export type FieldError = {
  __typename?: 'FieldError'
  message: Scalars['String']['output']
  path: SignupField
}

export type IdPayload = {
  __typename?: 'IDPayload'
  id: Scalars['ID']['output']
}

export type LoginError = Error & {
  __typename?: 'LoginError'
  code: Scalars['String']['output']
  message: Scalars['String']['output']
  path: Scalars['String']['output']
}

export type LoginPayload = {
  __typename?: 'LoginPayload'
  loginError?: Maybe<LoginError>
  tokens?: Maybe<AuthPayload>
}

export type MeInput = {
  id: Scalars['ID']['input']
  nickname: Scalars['String']['input']
  picture: Scalars['String']['input']
}

export type MeUser = DetailedUser &
  User & {
    __typename?: 'MeUser'
    email: Scalars['String']['output']
    id: Scalars['ID']['output']
    name: Scalars['String']['output']
    nickname: Scalars['String']['output']
    picture: Scalars['String']['output']
    preferences: Preferences
  }

export type Mutation = {
  __typename?: 'Mutation'
  createEvent: IdPayload
  deleteEvent?: Maybe<IdPayload>
  forgotPassword: Scalars['Boolean']['output']
  leaveEvent?: Maybe<Scalars['Boolean']['output']>
  login: LoginPayload
  participateEvent?: Maybe<Scalars['Boolean']['output']>
  refreshToken: RefreshPayload
  signup: SignupPayload
  updateAvatar: Scalars['Boolean']['output']
  updateEvent: Event
  updateMe: MeUser
}

export type MutationCreateEventArgs = {
  input: CreateEventInput
}

export type MutationDeleteEventArgs = {
  eventId: Scalars['ID']['input']
}

export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input']
}

export type MutationLeaveEventArgs = {
  eventId: Scalars['ID']['input']
}

export type MutationLoginArgs = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type MutationParticipateEventArgs = {
  eventId: Scalars['ID']['input']
  me: MeInput
}

export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input']
}

export type MutationSignupArgs = {
  input: SignupInput
}

export type MutationUpdateAvatarArgs = {
  uploadedFilename: Scalars['String']['input']
}

export type MutationUpdateEventArgs = {
  eventId: Scalars['ID']['input']
  input: UpdateEventInput
}

export type MutationUpdateMeArgs = {
  input: UpdateMeInput
}

export type OtherUser = DetailedUser &
  User & {
    __typename?: 'OtherUser'
    createdAt: Scalars['String']['output']
    email: Scalars['String']['output']
    id: Scalars['ID']['output']
    name: Scalars['String']['output']
    nickname: Scalars['String']['output']
    picture: Scalars['String']['output']
  }

export type Preferences = {
  __typename?: 'Preferences'
  subscribeEventCreationEmail: Scalars['Boolean']['output']
  subscribeWeeklyEmail: Scalars['Boolean']['output']
}

export type PreferencesInput = {
  subscribeEventCreationEmail: Scalars['Boolean']['input']
  subscribeWeeklyEmail: Scalars['Boolean']['input']
}

export type Query = {
  __typename?: 'Query'
  event?: Maybe<Event>
  events: Array<Event>
  eventsByUser: Array<Event>
  me: MeUser
  user?: Maybe<OtherUser>
  users: UsersResponse
}

export type QueryEventArgs = {
  eventId: Scalars['ID']['input']
}

export type QueryEventsByUserArgs = {
  userId: Scalars['String']['input']
}

export type QueryUserArgs = {
  nickname: Scalars['String']['input']
}

export type QueryUsersArgs = {
  page: Scalars['Int']['input']
  perPage: Scalars['Int']['input']
}

export type RefreshPayload = {
  __typename?: 'RefreshPayload'
  refreshError?: Maybe<Scalars['String']['output']>
  tokens?: Maybe<RefreshTokensPayload>
}

export type RefreshTokensPayload = {
  __typename?: 'RefreshTokensPayload'
  accessToken: Scalars['String']['output']
  expiresIn: Scalars['Int']['output']
  idToken: Scalars['String']['output']
}

export enum SignupField {
  Email = 'email',
  Name = 'name',
  Nickname = 'nickname',
  Password = 'password',
  RegisterSecret = 'registerSecret',
}

export type SignupInput = {
  email: Scalars['String']['input']
  name: Scalars['String']['input']
  nickname: Scalars['String']['input']
  password: Scalars['String']['input']
  registerSecret: Scalars['String']['input']
}

export type SignupPayload = {
  __typename?: 'SignupPayload'
  errors?: Maybe<Array<FieldError>>
  user?: Maybe<User>
}

export type TimeInput = {
  hours: Scalars['Int']['input']
  minutes: Scalars['Int']['input']
}

export type UpdateEventInput = {
  dateStart: DateInput
  description?: InputMaybe<Scalars['String']['input']>
  location: Scalars['String']['input']
  race: Scalars['Boolean']['input']
  subtitle: Scalars['String']['input']
  timeStart?: InputMaybe<TimeInput>
  title: Scalars['String']['input']
  type: EventType
}

export type UpdateMeInput = {
  preferences: PreferencesInput
}

export type User = {
  id: Scalars['ID']['output']
  nickname: Scalars['String']['output']
}

export type UserError = {
  message: Scalars['String']['output']
  path: Scalars['String']['output']
}

export type UsersResponse = {
  __typename?: 'UsersResponse'
  length: Scalars['Int']['output']
  limit: Scalars['Int']['output']
  start: Scalars['Int']['output']
  total: Scalars['Int']['output']
  users: Array<OtherUser>
}

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input']
}>

export type ForgotPasswordMutation = {
  __typename?: 'Mutation'
  forgotPassword: boolean
}

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}>

export type LoginMutation = {
  __typename?: 'Mutation'
  login: {
    __typename?: 'LoginPayload'
    tokens?: {
      __typename?: 'AuthPayload'
      accessToken: string
      idToken: string
      refreshToken: string
    } | null
    loginError?: {
      __typename?: 'LoginError'
      message: string
      path: string
      code: string
    } | null
  }
}

export type SignupMutationVariables = Exact<{
  name: Scalars['String']['input']
  email: Scalars['String']['input']
  password: Scalars['String']['input']
  nickname: Scalars['String']['input']
  registerSecret: Scalars['String']['input']
}>

export type SignupMutation = {
  __typename?: 'Mutation'
  signup: {
    __typename?: 'SignupPayload'
    user?:
      | { __typename?: 'Creator'; id: string }
      | { __typename?: 'EventParticipant'; id: string }
      | { __typename?: 'MeUser'; id: string }
      | { __typename?: 'OtherUser'; id: string }
      | null
    errors?: Array<{
      __typename?: 'FieldError'
      path: SignupField
      message: string
    }> | null
  }
}

export type GetEventQueryVariables = Exact<{
  eventId: Scalars['ID']['input']
}>

export type GetEventQuery = {
  __typename?: 'Query'
  event?: {
    __typename?: 'Event'
    id: string
    dateStart: any
    description?: string | null
    location: string
    race: boolean
    subtitle: string
    title: string
    timeStart?: string | null
    type: EventType
    createdBy: {
      __typename?: 'Creator'
      id: string
      nickname: string
      picture: string
    }
    participants: Array<{
      __typename?: 'EventParticipant'
      id: string
      joinedAt: string
      nickname: string
      picture: string
    }>
  } | null
}

export type ParticipateEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input']
  me: MeInput
}>

export type ParticipateEventMutation = {
  __typename?: 'Mutation'
  participateEvent?: boolean | null
}

export type LeaveEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input']
}>

export type LeaveEventMutation = {
  __typename?: 'Mutation'
  leaveEvent?: boolean | null
}

export type DeleteEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input']
}>

export type DeleteEventMutation = {
  __typename?: 'Mutation'
  deleteEvent?: { __typename?: 'IDPayload'; id: string } | null
}

export type GetEventsQueryVariables = Exact<{ [key: string]: never }>

export type GetEventsQuery = {
  __typename?: 'Query'
  events: Array<{
    __typename?: 'Event'
    id: string
    dateStart: any
    description?: string | null
    location: string
    race: boolean
    subtitle: string
    title: string
    timeStart?: string | null
    type: EventType
    createdBy: {
      __typename?: 'Creator'
      id: string
      nickname: string
      picture: string
    }
    participants: Array<{
      __typename?: 'EventParticipant'
      id: string
      joinedAt: string
      nickname: string
      picture: string
    }>
  }>
}

export type UpdateEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input']
  input: UpdateEventInput
}>

export type UpdateEventMutation = {
  __typename?: 'Mutation'
  updateEvent: { __typename?: 'Event'; id: string }
}

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput
}>

export type CreateEventMutation = {
  __typename?: 'Mutation'
  createEvent: { __typename?: 'IDPayload'; id: string }
}

export type GetUserByNickQueryVariables = Exact<{
  nickname: Scalars['String']['input']
}>

export type GetUserByNickQuery = {
  __typename?: 'Query'
  user?: {
    __typename?: 'OtherUser'
    id: string
    name: string
    nickname: string
    email: string
    picture: string
    createdAt: string
  } | null
}

export type GetUsersQueryVariables = Exact<{
  perPage: Scalars['Int']['input']
  page: Scalars['Int']['input']
}>

export type GetUsersQuery = {
  __typename?: 'Query'
  users: {
    __typename?: 'UsersResponse'
    length: number
    limit: number
    start: number
    total: number
    users: Array<{
      __typename?: 'OtherUser'
      id: string
      name: string
      nickname: string
    }>
  }
}

export type GetProfileQueryVariables = Exact<{ [key: string]: never }>

export type GetProfileQuery = {
  __typename?: 'Query'
  me: {
    __typename?: 'MeUser'
    id: string
    email: string
    name: string
    nickname: string
    picture: string
    preferences: {
      __typename?: 'Preferences'
      subscribeEventCreationEmail: boolean
      subscribeWeeklyEmail: boolean
    }
  }
}

export type UpdateMeMutationVariables = Exact<{
  subscribeWeeklyEmail: Scalars['Boolean']['input']
  subscribeEventCreationEmail: Scalars['Boolean']['input']
}>

export type UpdateMeMutation = {
  __typename?: 'Mutation'
  updateMe: {
    __typename?: 'MeUser'
    id: string
    nickname: string
    name: string
    preferences: {
      __typename?: 'Preferences'
      subscribeWeeklyEmail: boolean
      subscribeEventCreationEmail: boolean
    }
  }
}

export type UpdateAvatarMutationVariables = Exact<{
  uploadedFilename: Scalars['String']['input']
}>

export type UpdateAvatarMutation = {
  __typename?: 'Mutation'
  updateAvatar: boolean
}

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input']
}>

export type RefreshTokenMutation = {
  __typename?: 'Mutation'
  refreshToken: {
    __typename?: 'RefreshPayload'
    refreshError?: string | null
    tokens?: {
      __typename?: 'RefreshTokensPayload'
      idToken: string
      accessToken: string
    } | null
  }
}

export const ForgotPasswordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ForgotPassword' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'forgotPassword' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>
export const LoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Login' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'password' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'login' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'password' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tokens' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'accessToken' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'idToken' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'refreshToken' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'loginError' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'path' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>
export const SignupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Signup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'password' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'nickname' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'registerSecret' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'signup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'name' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'name' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'email' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'email' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'password' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'password' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'nickname' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'nickname' },
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'registerSecret' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'registerSecret' },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'errors' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'path' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>
export const GetEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'eventId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'event' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'eventId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'eventId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'createdBy' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nickname' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'picture' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'dateStart' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'location' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'participants' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'joinedAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nickname' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'picture' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'race' } },
                { kind: 'Field', name: { kind: 'Name', value: 'subtitle' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timeStart' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetEventQuery, GetEventQueryVariables>
export const ParticipateEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ParticipateEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'eventId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'me' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'MeInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participateEvent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'eventId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'eventId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'me' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'me' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ParticipateEventMutation,
  ParticipateEventMutationVariables
>
export const LeaveEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'LeaveEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'eventId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'leaveEvent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'eventId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'eventId' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LeaveEventMutation, LeaveEventMutationVariables>
export const DeleteEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'eventId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteEvent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'eventId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'eventId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteEventMutation, DeleteEventMutationVariables>
export const GetEventsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetEvents' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'events' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'createdBy' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nickname' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'picture' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'dateStart' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'location' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'participants' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'joinedAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nickname' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'picture' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'race' } },
                { kind: 'Field', name: { kind: 'Name', value: 'subtitle' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timeStart' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetEventsQuery, GetEventsQueryVariables>
export const UpdateEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'eventId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateEventInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateEvent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'eventId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'eventId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateEventMutation, UpdateEventMutationVariables>
export const CreateEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateEventInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createEvent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>
export const GetUserByNickDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetUserByNick' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'nickname' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'nickname' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'nickname' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'nickname' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'picture' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserByNickQuery, GetUserByNickQueryVariables>
export const GetUsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetUsers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'perPage' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'page' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'perPage' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'perPage' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'users' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nickname' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'length' } },
                { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>
export const GetProfileDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProfile' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'me' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'nickname' } },
                { kind: 'Field', name: { kind: 'Name', value: 'picture' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'preferences' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'subscribeEventCreationEmail',
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'subscribeWeeklyEmail' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProfileQuery, GetProfileQueryVariables>
export const UpdateMeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateMe' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'subscribeWeeklyEmail' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'Boolean' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'subscribeEventCreationEmail' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'Boolean' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateMe' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'preferences' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: {
                              kind: 'Name',
                              value: 'subscribeWeeklyEmail',
                            },
                            value: {
                              kind: 'Variable',
                              name: {
                                kind: 'Name',
                                value: 'subscribeWeeklyEmail',
                              },
                            },
                          },
                          {
                            kind: 'ObjectField',
                            name: {
                              kind: 'Name',
                              value: 'subscribeEventCreationEmail',
                            },
                            value: {
                              kind: 'Variable',
                              name: {
                                kind: 'Name',
                                value: 'subscribeEventCreationEmail',
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'nickname' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'preferences' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'subscribeWeeklyEmail' },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'subscribeEventCreationEmail',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateMeMutation, UpdateMeMutationVariables>
export const UpdateAvatarDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateAvatar' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'uploadedFilename' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateAvatar' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'uploadedFilename' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'uploadedFilename' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateAvatarMutation,
  UpdateAvatarMutationVariables
>
export const RefreshTokenDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RefreshToken' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'refreshToken' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'refreshToken' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'refreshToken' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'refreshToken' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tokens' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'idToken' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'accessToken' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'refreshError' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RefreshTokenMutation,
  RefreshTokenMutationVariables
>
