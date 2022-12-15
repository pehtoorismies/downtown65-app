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
  importEvents: Scalars['String'];
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


export type MutationImportEventsArgs = {
  end: Scalars['Int'];
  start: Scalars['Int'];
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
