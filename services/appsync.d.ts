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
  expiresIn: Scalars['String'];
  idToken: Scalars['String'];
};

export type BaseUser = {
  __typename?: 'BaseUser';
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nickname: Scalars['String'];
  picture: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  /** @deprecated exactTime is deprecated. Legacy. */
  exactTime?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  race: Scalars['Boolean'];
  subtitle?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type: EventType;
};

export type EventData = {
  date: Scalars['String'];
  exactTime?: InputMaybe<Scalars['Boolean']>;
  race?: InputMaybe<Scalars['Boolean']>;
  subtitle?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export type EventType =
  | 'KARONKKA'
  | 'MEETING'
  | 'NORDIC_WALKING'
  | 'ORIENTEERING'
  | 'OTHER'
  | 'RUNNING'
  | 'SKIING'
  | 'SPINNING'
  | 'SWIMMING'
  | 'TRACK_RUNNING'
  | 'TRAIL_RUNNING'
  | 'TRIATHLON'
  | 'ULTRAS';

export type Mutation = {
  __typename?: 'Mutation';
  createEvent: Event;
  forgotPassword: Scalars['Boolean'];
  login: AuthPayload;
  signup: User;
};


export type MutationCreateEventArgs = {
  addMe?: InputMaybe<Scalars['Boolean']>;
  event: EventData;
  notifySubscribers?: InputMaybe<Scalars['Boolean']>;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
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

export type Preferences = {
  __typename?: 'Preferences';
  subscribeEventCreationEmail: Scalars['Boolean'];
  subscribeWeeklyEmail: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  event?: Maybe<Event>;
  events: Array<Event>;
  /** @deprecated findEvent is deprecated. Use event instead. */
  findEvent?: Maybe<Event>;
  /** @deprecated findManyEvents is deprecated. Use events instead. */
  findManyEvents: Array<Event>;
  me: User;
  users: Array<BaseUser>;
};


export type QueryEventArgs = {
  eventId: Scalars['String'];
};


export type QueryFindEventArgs = {
  eventId: Scalars['String'];
};


export type QueryFindManyEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['AWSDateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  nickname?: Maybe<Scalars['String']>;
  preferences: Preferences;
  updatedAt?: Maybe<Scalars['AWSDateTime']>;
};
