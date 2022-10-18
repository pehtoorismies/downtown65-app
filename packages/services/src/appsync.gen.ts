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

export type Auth0User = {
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nickname?: Maybe<Scalars['String']>;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String'];
  expiresIn: Scalars['Int'];
  idToken: Scalars['String'];
};

export type BaseUser = Auth0User & {
  __typename?: 'BaseUser';
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nickname: Scalars['String'];
  picture: Scalars['String'];
};

export type CreateEventInput = {
  dateStart: Scalars['AWSDateTime'];
  race?: InputMaybe<Scalars['Boolean']>;
  subtitle?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export type Error = {
  code: Scalars['String'];
  message: Scalars['String'];
  path: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  dateStart: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  participants: Array<Participant>;
  race: Scalars['Boolean'];
  subtitle?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type: EventType;
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

export type Mutation = {
  __typename?: 'Mutation';
  createEvent: Event;
  deleteEvent?: Maybe<IdPayload>;
  forgotPassword: Scalars['Boolean'];
  joinEvent?: Maybe<Event>;
  leaveEvent?: Maybe<Event>;
  login: LoginPayload;
  signup: User;
  updateEvent: Event;
  updateMe: User;
};


export type MutationCreateEventArgs = {
  addMe?: InputMaybe<Scalars['Boolean']>;
  event: CreateEventInput;
  notifySubscribers?: InputMaybe<Scalars['Boolean']>;
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
  email: Scalars['String'];
  name: Scalars['String'];
  nickname: Scalars['String'];
  password: Scalars['String'];
  registerSecret: Scalars['String'];
};


export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};

export type Participant = {
  __typename?: 'Participant';
  joinedAt: Scalars['AWSDateTime'];
  nick: Scalars['String'];
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
  me: User;
  users: Array<BaseUser>;
};


export type QueryEventArgs = {
  eventId: Scalars['ID'];
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
  name?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  preferences: PreferencesInput;
};

export type User = Auth0User & {
  __typename?: 'User';
  createdAt: Scalars['AWSDateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nickname?: Maybe<Scalars['String']>;
  preferences: Preferences;
  updatedAt?: Maybe<Scalars['AWSDateTime']>;
};
