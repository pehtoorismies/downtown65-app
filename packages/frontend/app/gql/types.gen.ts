import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  AWSDateTime: any;
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
  dateStart: Scalars['AWSDateTime'];
  description?: InputMaybe<Scalars['String']>;
  location: Scalars['String'];
  participants?: InputMaybe<Array<MeInput>>;
  race: Scalars['Boolean'];
  title: Scalars['String'];
  type: Scalars['String'];
};

export type Creator = User & {
  __typename?: 'Creator';
  id: Scalars['ID'];
  nickname: Scalars['String'];
  picture: Scalars['String'];
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
  dateStart: Scalars['AWSDateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  location: Scalars['String'];
  participants: Array<EventParticipant>;
  race: Scalars['Boolean'];
  title: Scalars['String'];
  type: EventType;
};

export type EventParticipant = User & {
  __typename?: 'EventParticipant';
  id: Scalars['ID'];
  joinedAt: Scalars['AWSDateTime'];
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
  createEvent: Event;
  deleteEvent?: Maybe<IdPayload>;
  forgotPassword: Scalars['Boolean'];
  joinEvent?: Maybe<Scalars['Boolean']>;
  leaveEvent?: Maybe<Scalars['Boolean']>;
  login: LoginPayload;
  signup: SignupPayload;
  updateEvent: Event;
  updateMe: MeUser;
};


export type MutationCreateEventArgs = {
  event: CreateEventInput;
};


export type MutationDeleteEventArgs = {
  eventId: Scalars['ID'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationJoinEventArgs = {
  eventId: Scalars['ID'];
};


export type MutationLeaveEventArgs = {
  eventId: Scalars['ID'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationUpdateEventArgs = {
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
  me: MeUser;
  users: Array<OtherUser>;
};


export type QueryEventArgs = {
  eventId: Scalars['ID'];
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

export type UpdateEventInput = {
  dateStart?: InputMaybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  race?: InputMaybe<Scalars['Boolean']>;
  subtitle?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
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

export type BaseFieldsFragment = { __typename?: 'Event', id: string, dateStart: any, description?: string | null, location: string, race: boolean, title: string, type: EventType, participants: Array<{ __typename?: 'EventParticipant', id: string, joinedAt: any, nickname: string, picture: string }> };

export type GetEventQueryVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type GetEventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: string, dateStart: any, description?: string | null, location: string, race: boolean, title: string, type: EventType, participants: Array<{ __typename?: 'EventParticipant', id: string, joinedAt: any, nickname: string, picture: string }> } | null };

export type GetEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'Event', id: string, dateStart: any, description?: string | null, location: string, race: boolean, title: string, type: EventType, participants: Array<{ __typename?: 'EventParticipant', id: string, joinedAt: any, nickname: string, picture: string }> }> };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'Event', id: string, dateStart: any, description?: string | null, location: string, race: boolean, title: string, type: EventType, participants: Array<{ __typename?: 'EventParticipant', id: string, joinedAt: any, nickname: string, picture: string }> } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', tokens?: { __typename?: 'AuthPayload', accessToken: string, idToken: string, refreshToken: string } | null, loginError?: { __typename?: 'LoginError', message: string, path: string, code: string } | null } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', me: { __typename?: 'MeUser', id: string, email: string, name: string, nickname: string, preferences: { __typename?: 'Preferences', subscribeEventCreationEmail: boolean, subscribeWeeklyEmail: boolean } } };

export type SignupMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  nickname: Scalars['String'];
  registerSecret: Scalars['String'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'SignupPayload', user?: { __typename?: 'Creator', id: string } | { __typename?: 'EventParticipant', id: string } | { __typename?: 'MeUser', id: string } | { __typename?: 'OtherUser', id: string } | null, errors?: Array<{ __typename?: 'FieldError', path: SignupField, message: string }> | null } };

export type UpdateMeMutationVariables = Exact<{
  subscribeWeeklyEmail: Scalars['Boolean'];
  subscribeEventCreationEmail: Scalars['Boolean'];
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'MeUser', id: string, nickname: string, name: string, preferences: { __typename?: 'Preferences', subscribeWeeklyEmail: boolean, subscribeEventCreationEmail: boolean } } };

export const BaseFieldsFragmentDoc = gql`
    fragment baseFields on Event {
  id
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
  title
  type
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
  createEvent(event: $input) {
    ...baseFields
  }
}
    ${BaseFieldsFragmentDoc}`;
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
export const GetProfileDocument = gql`
    query GetProfile {
  me {
    id
    email
    name
    nickname
    preferences {
      subscribeEventCreationEmail
      subscribeWeeklyEmail
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetEvent(variables: GetEventQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetEventQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEventQuery>(GetEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEvent', 'query');
    },
    GetEvents(variables?: GetEventsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEventsQuery>(GetEventsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEvents', 'query');
    },
    CreateEvent(variables: CreateEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateEventMutation>(CreateEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateEvent', 'mutation');
    },
    ForgotPassword(variables: ForgotPasswordMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ForgotPasswordMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ForgotPasswordMutation>(ForgotPasswordDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ForgotPassword', 'mutation');
    },
    Login(variables: LoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>(LoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Login', 'mutation');
    },
    GetProfile(variables?: GetProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProfileQuery>(GetProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetProfile', 'query');
    },
    Signup(variables: SignupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignupMutation>(SignupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Signup', 'mutation');
    },
    UpdateMe(variables: UpdateMeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateMeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateMeMutation>(UpdateMeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateMe', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;