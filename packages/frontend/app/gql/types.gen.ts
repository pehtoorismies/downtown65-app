import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T |  undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: any;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String'];
  expiresIn: Scalars['Int'];
  idToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type CreateEventInput = {
  createdBy: MeInput;
  dateStart: DateInput;
  description?: InputMaybe<Scalars['String']>;
  location: Scalars['String'];
  participants?: InputMaybe<Array<MeInput>>;
  race: Scalars['Boolean'];
  subtitle: Scalars['String'];
  timeStart?: InputMaybe<TimeInput>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export type Creator = User & {
  __typename?: 'Creator';
  id: Scalars['ID'];
  nickname: Scalars['String'];
  picture: Scalars['String'];
};

export type DateInput = {
  day: Scalars['Int'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type DetailedUser = {
  email: Scalars['String'];
  name: Scalars['String'];
  picture: Scalars['String'];
};

export type Error = {
  code: Scalars['String'];
  message: Scalars['String'];
  path: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  createdBy: Creator;
  dateStart: Scalars['AWSDate'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  location: Scalars['String'];
  participants: Array<EventParticipant>;
  race: Scalars['Boolean'];
  subtitle: Scalars['String'];
  timeStart?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type: EventType;
};

export type EventParticipant = User & {
  __typename?: 'EventParticipant';
  id: Scalars['ID'];
  joinedAt: Scalars['String'];
  nickname: Scalars['String'];
  picture: Scalars['String'];
};

export const EventType = {
  Cycling: 'CYCLING',
  Karonkka: 'KARONKKA',
  Meeting: 'MEETING',
  NordicWalking: 'NORDIC_WALKING',
  Orienteering: 'ORIENTEERING',
  Other: 'OTHER',
  Running: 'RUNNING',
  Skiing: 'SKIING',
  Spinning: 'SPINNING',
  Swimming: 'SWIMMING',
  TrackRunning: 'TRACK_RUNNING',
  TrailRunning: 'TRAIL_RUNNING',
  Triathlon: 'TRIATHLON',
  Ultras: 'ULTRAS'
} as const;

export type EventType = typeof EventType[keyof typeof EventType];
export type FieldError = {
  __typename?: 'FieldError';
  message: Scalars['String'];
  path: SignupField;
};

export type IdPayload = {
  __typename?: 'IDPayload';
  id: Scalars['ID'];
};

export type LoginError = Error & {
  __typename?: 'LoginError';
  code: Scalars['String'];
  message: Scalars['String'];
  path: Scalars['String'];
};

export type LoginPayload = {
  __typename?: 'LoginPayload';
  loginError?: Maybe<LoginError>;
  tokens?: Maybe<AuthPayload>;
};

export type MeInput = {
  id: Scalars['ID'];
  nickname: Scalars['String'];
  picture: Scalars['String'];
};

export type MeUser = DetailedUser & User & {
  __typename?: 'MeUser';
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nickname: Scalars['String'];
  picture: Scalars['String'];
  preferences: Preferences;
};

export type Mutation = {
  __typename?: 'Mutation';
  createEvent: IdPayload;
  deleteEvent?: Maybe<IdPayload>;
  forgotPassword: Scalars['Boolean'];
  leaveEvent?: Maybe<Scalars['Boolean']>;
  login: LoginPayload;
  participateEvent?: Maybe<Scalars['Boolean']>;
  refreshToken: RefreshPayload;
  signup: SignupPayload;
  updateEvent: Event;
  updateMe: MeUser;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationDeleteEventArgs = {
  eventId: Scalars['ID'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLeaveEventArgs = {
  eventId: Scalars['ID'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationParticipateEventArgs = {
  eventId: Scalars['ID'];
  me: MeInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String'];
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationUpdateEventArgs = {
  eventId: Scalars['ID'];
  input: UpdateEventInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};

export type OtherUser = DetailedUser & User & {
  __typename?: 'OtherUser';
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nickname: Scalars['String'];
  picture: Scalars['String'];
};

export type Preferences = {
  __typename?: 'Preferences';
  subscribeEventCreationEmail: Scalars['Boolean'];
  subscribeWeeklyEmail: Scalars['Boolean'];
};

export type PreferencesInput = {
  subscribeEventCreationEmail: Scalars['Boolean'];
  subscribeWeeklyEmail: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  event?: Maybe<Event>;
  events: Array<Event>;
  eventsByUser: Array<Event>;
  me: MeUser;
  users: UsersResponse;
};


export type QueryEventArgs = {
  eventId: Scalars['ID'];
};


export type QueryEventsByUserArgs = {
  userId: Scalars['String'];
};


export type QueryUsersArgs = {
  page: Scalars['Int'];
  perPage: Scalars['Int'];
};

export type RefreshPayload = {
  __typename?: 'RefreshPayload';
  refreshError?: Maybe<Scalars['String']>;
  tokens?: Maybe<RefreshTokensPayload>;
};

export type RefreshTokensPayload = {
  __typename?: 'RefreshTokensPayload';
  accessToken: Scalars['String'];
  expiresIn: Scalars['Int'];
  idToken: Scalars['String'];
};

export const SignupField = {
  Email: 'email',
  Name: 'name',
  Nickname: 'nickname',
  Password: 'password',
  RegisterSecret: 'registerSecret'
} as const;

export type SignupField = typeof SignupField[keyof typeof SignupField];
export type SignupInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  nickname: Scalars['String'];
  password: Scalars['String'];
  registerSecret: Scalars['String'];
};

export type SignupPayload = {
  __typename?: 'SignupPayload';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type TimeInput = {
  hours: Scalars['Int'];
  minutes: Scalars['Int'];
};

export type UpdateEventInput = {
  dateStart: DateInput;
  description?: InputMaybe<Scalars['String']>;
  location: Scalars['String'];
  race: Scalars['Boolean'];
  subtitle: Scalars['String'];
  timeStart?: InputMaybe<TimeInput>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export type UpdateMeInput = {
  preferences: PreferencesInput;
};

export type User = {
  id: Scalars['ID'];
  nickname: Scalars['String'];
};

export type UserError = {
  message: Scalars['String'];
  path: Scalars['String'];
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  length: Scalars['Int'];
  limit: Scalars['Int'];
  start: Scalars['Int'];
  total: Scalars['Int'];
  users: Array<OtherUser>;
};

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', tokens?: { __typename?: 'AuthPayload', accessToken: string, idToken: string, refreshToken: string } |  undefined, loginError?: { __typename?: 'LoginError', message: string, path: string, code: string } |  undefined } };

export type SignupMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  nickname: Scalars['String'];
  registerSecret: Scalars['String'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'SignupPayload', user?: { __typename?: 'Creator', id: string } | { __typename?: 'EventParticipant', id: string } | { __typename?: 'MeUser', id: string } | { __typename?: 'OtherUser', id: string } |  undefined, errors?: Array<{ __typename?: 'FieldError', path: SignupField, message: string }> |  undefined } };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'RefreshPayload', refreshError?: string |  undefined, tokens?: { __typename?: 'RefreshTokensPayload', idToken: string, accessToken: string } |  undefined } };

export type BaseFieldsFragment = { __typename?: 'Event', id: string, dateStart: any, description?: string |  undefined, location: string, race: boolean, subtitle: string, title: string, timeStart?: string |  undefined, type: EventType, createdBy: { __typename?: 'Creator', id: string, nickname: string, picture: string }, participants: Array<{ __typename?: 'EventParticipant', id: string, joinedAt: string, nickname: string, picture: string }> };

export type GetEventQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type GetEventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: string, dateStart: any, description?: string |  undefined, location: string, race: boolean, subtitle: string, title: string, timeStart?: string |  undefined, type: EventType, createdBy: { __typename?: 'Creator', id: string, nickname: string, picture: string }, participants: Array<{ __typename?: 'EventParticipant', id: string, joinedAt: string, nickname: string, picture: string }> } |  undefined };

export type GetEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'Event', id: string, dateStart: any, description?: string |  undefined, location: string, race: boolean, subtitle: string, title: string, timeStart?: string |  undefined, type: EventType, createdBy: { __typename?: 'Creator', id: string, nickname: string, picture: string }, participants: Array<{ __typename?: 'EventParticipant', id: string, joinedAt: string, nickname: string, picture: string }> }> };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'IDPayload', id: string } };

export type ParticipateEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  me: MeInput;
}>;


export type ParticipateEventMutation = { __typename?: 'Mutation', participateEvent?: boolean |  undefined };

export type LeaveEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type LeaveEventMutation = { __typename?: 'Mutation', leaveEvent?: boolean |  undefined };

export type DeleteEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent?: { __typename?: 'IDPayload', id: string } |  undefined };

export type UpdateEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  input: UpdateEventInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: { __typename?: 'Event', id: string } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', me: { __typename?: 'MeUser', id: string, email: string, name: string, nickname: string, picture: string, preferences: { __typename?: 'Preferences', subscribeEventCreationEmail: boolean, subscribeWeeklyEmail: boolean } } };

export type UpdateMeMutationVariables = Exact<{
  subscribeWeeklyEmail: Scalars['Boolean'];
  subscribeEventCreationEmail: Scalars['Boolean'];
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'MeUser', id: string, nickname: string, name: string, preferences: { __typename?: 'Preferences', subscribeWeeklyEmail: boolean, subscribeEventCreationEmail: boolean } } };

export type GetUsersQueryVariables = Exact<{
  perPage: Scalars['Int'];
  page: Scalars['Int'];
}>;


export type GetUsersQuery = { __typename?: 'Query', users: { __typename?: 'UsersResponse', length: number, limit: number, start: number, total: number, users: Array<{ __typename?: 'OtherUser', id: string, name: string, nickname: string }> } };

export const BaseFieldsFragmentDoc = gql`
    fragment baseFields on Event {
  id
  createdBy {
    id
    nickname
    picture
  }
  dateStart
  description
  location
  participants {
    id
    joinedAt
    nickname
    picture
  }
  race
  subtitle
  title
  timeStart
  type
}
    `;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    tokens {
      accessToken
      idToken
      refreshToken
    }
    loginError {
      message
      path
      code
    }
  }
}
    `;
export const SignupDocument = gql`
    mutation Signup($name: String!, $email: String!, $password: String!, $nickname: String!, $registerSecret: String!) {
  signup(
    input: {name: $name, email: $email, password: $password, nickname: $nickname, registerSecret: $registerSecret}
  ) {
    user {
      id
    }
    errors {
      path
      message
    }
  }
}
    `;
export const RefreshTokenDocument = gql`
    mutation RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    tokens {
      idToken
      accessToken
    }
    refreshError
  }
}
    `;
export const GetEventDocument = gql`
    query GetEvent($eventId: ID!) {
  event(eventId: $eventId) {
    ...baseFields
  }
}
    ${BaseFieldsFragmentDoc}`;
export const GetEventsDocument = gql`
    query GetEvents {
  events {
    ...baseFields
  }
}
    ${BaseFieldsFragmentDoc}`;
export const CreateEventDocument = gql`
    mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    id
  }
}
    `;
export const ParticipateEventDocument = gql`
    mutation ParticipateEvent($eventId: ID!, $me: MeInput!) {
  participateEvent(eventId: $eventId, me: $me)
}
    `;
export const LeaveEventDocument = gql`
    mutation LeaveEvent($eventId: ID!) {
  leaveEvent(eventId: $eventId)
}
    `;
export const DeleteEventDocument = gql`
    mutation DeleteEvent($eventId: ID!) {
  deleteEvent(eventId: $eventId) {
    id
  }
}
    `;
export const UpdateEventDocument = gql`
    mutation UpdateEvent($eventId: ID!, $input: UpdateEventInput!) {
  updateEvent(eventId: $eventId, input: $input) {
    id
  }
}
    `;
export const GetProfileDocument = gql`
    query GetProfile {
  me {
    id
    email
    name
    nickname
    picture
    preferences {
      subscribeEventCreationEmail
      subscribeWeeklyEmail
    }
  }
}
    `;
export const UpdateMeDocument = gql`
    mutation UpdateMe($subscribeWeeklyEmail: Boolean!, $subscribeEventCreationEmail: Boolean!) {
  updateMe(
    input: {preferences: {subscribeWeeklyEmail: $subscribeWeeklyEmail, subscribeEventCreationEmail: $subscribeEventCreationEmail}}
  ) {
    id
    nickname
    name
    preferences {
      subscribeWeeklyEmail
      subscribeEventCreationEmail
    }
  }
}
    `;
export const GetUsersDocument = gql`
    query GetUsers($perPage: Int!, $page: Int!) {
  users(page: $page, perPage: $perPage) {
    users {
      id
      name
      nickname
    }
    length
    limit
    start
    total
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    ForgotPassword(variables: ForgotPasswordMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ForgotPasswordMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ForgotPasswordMutation>(ForgotPasswordDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ForgotPassword', 'mutation');
    },
    Login(variables: LoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>(LoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Login', 'mutation');
    },
    Signup(variables: SignupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignupMutation>(SignupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Signup', 'mutation');
    },
    RefreshToken(variables: RefreshTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RefreshTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RefreshTokenMutation>(RefreshTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RefreshToken', 'mutation');
    },
    GetEvent(variables: GetEventQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetEventQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEventQuery>(GetEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEvent', 'query');
    },
    GetEvents(variables?: GetEventsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEventsQuery>(GetEventsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEvents', 'query');
    },
    CreateEvent(variables: CreateEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateEventMutation>(CreateEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateEvent', 'mutation');
    },
    ParticipateEvent(variables: ParticipateEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ParticipateEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ParticipateEventMutation>(ParticipateEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ParticipateEvent', 'mutation');
    },
    LeaveEvent(variables: LeaveEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LeaveEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LeaveEventMutation>(LeaveEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'LeaveEvent', 'mutation');
    },
    DeleteEvent(variables: DeleteEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteEventMutation>(DeleteEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteEvent', 'mutation');
    },
    UpdateEvent(variables: UpdateEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateEventMutation>(UpdateEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateEvent', 'mutation');
    },
    GetProfile(variables?: GetProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProfileQuery>(GetProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetProfile', 'query');
    },
    UpdateMe(variables: UpdateMeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateMeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateMeMutation>(UpdateMeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateMe', 'mutation');
    },
    GetUsers(variables: GetUsersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUsersQuery>(GetUsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetUsers', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;