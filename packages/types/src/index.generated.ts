import type { ISODate, ISOTime } from '@downtown65-app/time'
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
  K extends keyof T,
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
  AWSDate: { input: ISODate; output: ISODate }
  AWSEmail: { input: string; output: string }
  AWSTime: { input: ISOTime; output: ISOTime }
}

export type AccomplishmentInput = {
  date: Scalars['AWSDate']['input']
  id: Scalars['ID']['input']
  userId: Scalars['ID']['input']
}

export type AuthError = {
  error: Scalars['String']['output']
  message: Scalars['String']['output']
  statusCode: Scalars['Int']['output']
}

export type Challenge = {
  __typename: 'Challenge'
  createdBy: Creator
  dateEnd: Scalars['AWSDate']['output']
  dateStart: Scalars['AWSDate']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  participants: Array<ChallengeParticipant>
  subtitle: Scalars['String']['output']
  title: Scalars['String']['output']
}

export type ChallengeFilter = {
  dateEnd: DateFilter
}

export type ChallengeParticipant = User & {
  __typename: 'ChallengeParticipant'
  accomplishedDates?: Maybe<Array<Scalars['AWSDate']['output']>>
  id: Scalars['ID']['output']
  joinedAt: Scalars['String']['output']
  nickname: Scalars['String']['output']
  picture: Scalars['String']['output']
}

export type CreateChallengeInput = {
  createdBy: MeInput
  dateEnd: Scalars['AWSDate']['input']
  dateStart: Scalars['AWSDate']['input']
  description?: InputMaybe<Scalars['String']['input']>
  subtitle: Scalars['String']['input']
  title: Scalars['String']['input']
}

export type CreateEventInput = {
  createdBy: MeInput
  dateStart: Scalars['AWSDate']['input']
  description?: InputMaybe<Scalars['String']['input']>
  location: Scalars['String']['input']
  participants?: InputMaybe<Array<MeInput>>
  race: Scalars['Boolean']['input']
  subtitle: Scalars['String']['input']
  timeStart?: InputMaybe<Scalars['AWSTime']['input']>
  title: Scalars['String']['input']
  type: EventType
}

export type Creator = User & {
  __typename: 'Creator'
  id: Scalars['ID']['output']
  nickname: Scalars['String']['output']
  picture: Scalars['String']['output']
}

export type DateFilter = {
  after?: InputMaybe<Scalars['AWSDate']['input']>
  before?: InputMaybe<Scalars['AWSDate']['input']>
}

export type DetailedUser = {
  email: Scalars['String']['output']
  name: Scalars['String']['output']
  picture: Scalars['String']['output']
}

export type Event = {
  __typename: 'Event'
  createdBy: Creator
  dateStart: Scalars['AWSDate']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  location: Scalars['String']['output']
  participants: Array<Participant>
  race: Scalars['Boolean']['output']
  subtitle: Scalars['String']['output']
  timeStart?: Maybe<Scalars['AWSTime']['output']>
  title: Scalars['String']['output']
  type: EventType
}

export enum EventType {
  Cycling = 'CYCLING',
  IceHockey = 'ICE_HOCKEY',
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
  __typename: 'FieldError'
  message: Scalars['String']['output']
  path: SignupField
}

export type IdPayload = {
  __typename: 'IDPayload'
  id: Scalars['ID']['output']
}

export type LoginError = AuthError & {
  __typename: 'LoginError'
  error: Scalars['String']['output']
  message: Scalars['String']['output']
  statusCode: Scalars['Int']['output']
}

export type LoginResponse = LoginError | Tokens

export type MeInput = {
  id: Scalars['ID']['input']
  nickname: Scalars['String']['input']
  picture: Scalars['String']['input']
}

export type MeUser = DetailedUser &
  User & {
    __typename: 'MeUser'
    email: Scalars['String']['output']
    id: Scalars['ID']['output']
    name: Scalars['String']['output']
    nickname: Scalars['String']['output']
    picture: Scalars['String']['output']
    preferences: Preferences
  }

export type Mutation = {
  __typename: 'Mutation'
  addChallengeAccomplishment?: Maybe<Scalars['Boolean']['output']>
  createChallenge: IdPayload
  createEvent: IdPayload
  deleteEvent?: Maybe<IdPayload>
  forgotPassword: Scalars['Boolean']['output']
  leaveChallenge: Scalars['Boolean']['output']
  leaveEvent?: Maybe<Scalars['Boolean']['output']>
  login: LoginResponse
  participateChallenge: Scalars['Boolean']['output']
  participateEvent?: Maybe<Scalars['Boolean']['output']>
  refreshToken: RefreshResponse
  removeChallengeAccomplishment?: Maybe<Scalars['Boolean']['output']>
  signup: SignupResponse
  updateAvatar: Scalars['Boolean']['output']
  updateEvent: Event
  updateMe: MeUser
}

export type MutationAddChallengeAccomplishmentArgs = {
  input: AccomplishmentInput
}

export type MutationCreateChallengeArgs = {
  input: CreateChallengeInput
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

export type MutationLeaveChallengeArgs = {
  id: Scalars['ID']['input']
}

export type MutationLeaveEventArgs = {
  eventId: Scalars['ID']['input']
}

export type MutationLoginArgs = {
  email: Scalars['AWSEmail']['input']
  password: Scalars['String']['input']
}

export type MutationParticipateChallengeArgs = {
  id: Scalars['ID']['input']
  me: MeInput
}

export type MutationParticipateEventArgs = {
  eventId: Scalars['ID']['input']
  me: MeInput
}

export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input']
}

export type MutationRemoveChallengeAccomplishmentArgs = {
  input: AccomplishmentInput
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
    __typename: 'OtherUser'
    createdAt: Scalars['String']['output']
    email: Scalars['String']['output']
    id: Scalars['ID']['output']
    name: Scalars['String']['output']
    nickname: Scalars['String']['output']
    picture: Scalars['String']['output']
  }

export type Participant = User & {
  __typename: 'Participant'
  id: Scalars['ID']['output']
  joinedAt: Scalars['String']['output']
  nickname: Scalars['String']['output']
  picture: Scalars['String']['output']
}

export type Preferences = {
  __typename: 'Preferences'
  subscribeEventCreationEmail: Scalars['Boolean']['output']
  subscribeWeeklyEmail: Scalars['Boolean']['output']
}

export type PreferencesInput = {
  subscribeEventCreationEmail: Scalars['Boolean']['input']
  subscribeWeeklyEmail: Scalars['Boolean']['input']
}

export type Query = {
  __typename: 'Query'
  challenge?: Maybe<Challenge>
  challenges: Array<Challenge>
  event?: Maybe<Event>
  events: Array<Event>
  me: MeUser
  user?: Maybe<OtherUser>
  users: UsersResponse
}

export type QueryChallengeArgs = {
  id: Scalars['ID']['input']
}

export type QueryChallengesArgs = {
  filter?: InputMaybe<ChallengeFilter>
}

export type QueryEventArgs = {
  eventId: Scalars['ID']['input']
}

export type QueryUserArgs = {
  nickname: Scalars['String']['input']
}

export type QueryUsersArgs = {
  page: Scalars['Int']['input']
  perPage: Scalars['Int']['input']
}

export type RefreshError = AuthError & {
  __typename: 'RefreshError'
  error: Scalars['String']['output']
  message: Scalars['String']['output']
  statusCode: Scalars['Int']['output']
}

export type RefreshResponse = RefreshError | RefreshTokens

export type RefreshTokens = {
  __typename: 'RefreshTokens'
  accessToken: Scalars['String']['output']
  expiresIn: Scalars['Int']['output']
  idToken: Scalars['String']['output']
}

export type SignupError = AuthError & {
  __typename: 'SignupError'
  error: Scalars['String']['output']
  message: Scalars['String']['output']
  statusCode: Scalars['Int']['output']
}

export enum SignupField {
  Email = 'email',
  Name = 'name',
  Nickname = 'nickname',
  Password = 'password',
  RegisterSecret = 'registerSecret',
}

export type SignupFieldError = {
  __typename: 'SignupFieldError'
  errors: Array<FieldError>
}

export type SignupInput = {
  email: Scalars['AWSEmail']['input']
  name: Scalars['String']['input']
  nickname: Scalars['String']['input']
  password: Scalars['String']['input']
  registerSecret: Scalars['String']['input']
}

export type SignupResponse = SignupError | SignupFieldError | SignupSuccess

export type SignupSuccess = {
  __typename: 'SignupSuccess'
  message: Scalars['String']['output']
}

export type Tokens = {
  __typename: 'Tokens'
  accessToken: Scalars['String']['output']
  expiresIn: Scalars['Int']['output']
  idToken: Scalars['String']['output']
  refreshToken: Scalars['String']['output']
}

export type UpdateEventInput = {
  dateStart: Scalars['AWSDate']['input']
  description?: InputMaybe<Scalars['String']['input']>
  location: Scalars['String']['input']
  race: Scalars['Boolean']['input']
  subtitle: Scalars['String']['input']
  timeStart?: InputMaybe<Scalars['AWSTime']['input']>
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
  __typename: 'UsersResponse'
  length: Scalars['Int']['output']
  limit: Scalars['Int']['output']
  start: Scalars['Int']['output']
  total: Scalars['Int']['output']
  users: Array<OtherUser>
}
