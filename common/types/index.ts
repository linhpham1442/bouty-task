export interface User {}

export interface Abi {
  name: string;
  address: string;
  chain_id: string;
  abi: any;
}

export interface FetchReducer {
  loading: false;
  error: null;
  success: null;
}

export interface ListResponse<T> {
  data: T;
  count: number;
}

export interface BountyTask {
  _id: string;
  title: string;
  description: string;
  duration: number;
  max_headcount: number;
  duration_type: string;
  skills: Skill[];
  category: string;
  type_work_entry: number;
  chain_id: string;
  token_address: string;
  fixed_amount: number;
  task_id: number;
  status: number;
  owner: IMeProfile;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  _id: string;
  bounty_task_id: BountyTask | string;
  bounty_task: BountyTask;
  type: number;
  status: number;
  owner_id: IMeProfile;
  owner: IMeProfile;
  expired_at: Date;
  submitted_at: Date;
  paid_at: Date;
  created_at: Date;
  updated_at: Date;
  cancelled_at?: Date;
}

export interface TaskRequestJoin {
  _id: string;
  bounty_task: BountyTask;
  owner: IMeProfile;
  status: number;
  created_at: Date;
  updated_at: Date;
  description?: string
}

export interface UserToken {
  _id: string;
  token_address: string;
  chain_id: string;
  owner_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}
export interface Category {
  _id: string;
  description: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}
export interface Skill {
  _id: string;
  description: string;
  name: string;
  category_id: string;
  created_at: Date;
  updated_at: Date;
}
export interface Network {
  _id: string;
  chain_id: string;
  block_explorer_url: string;
  usdt_address: string;
  scan_domain: string;
  currency_symbol: string;
  swap_address: string;
  new_rpc_url: string;
  scan_api_key: string;
  wrap_token_address: string;
  currency_name: string;
  network_name: string;
  gnosis_server_url: string;
  root_scan_domain: string;
  decimals: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUserProfile {
  role?: number;
  display_name: string;
  id: string;
  avatar: string;
  wallet_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IMeProfile {
  _id: string;
  oAuth2Id: string;
  email: string;
  avatar: string;
  display_name: string;
  created_at: Date;
  updated_at: Date;
  wallet_id: string;
  role: number;
  skillIds: string[];
  skills: Skill[],
  rating: number,
  proofOfwork: number;
}

export enum UserRole {
  manager = 1,
  contributor = 2,
  none = 0,
}

export interface Submission {
  _id: string;
  owner_id: IMeProfile;
  owner: IMeProfile;
  bounty_task_id: string;
  task_id: string;
  content: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export interface IComment {
  _id: string;
  owner: IMeProfile;
  task_id: string;
  content: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export interface IDiscuss {
  count: number;
  data: IListDiscuss[];
  offset: string;
}

export interface IListDiscuss {
  _id: string;
  owner: IMeProfile;
  task_id: string;
  content: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}
export interface ISkill {
  _id: string;
  name: string;
  description: string;
  category_id: string;
}

export enum oAuth2UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export interface IAuthInformation {
  _id: string;
  email: string;
  type: LoginType;
  displayName: string;
  emailVerified: boolean;
  status: oAuth2UserStatus;
}

export type LoginType = "FACEBOOK" | "GOOGLE" | "TWITTER";
export interface IUserInformation {
  loginType: LoginType;
  name: string;
  wallet_id: string;
  proofOfWork?: number;
  proof_of_work: any;
  rating: number;
  skills: ISkill[];
  joinDate: Date;
  avatar: string;
}

export interface ICategory {
  icon: string;
  description: string;
  name: string;
  _id: string;
}

export enum TaskType {
  Cancel = 0,
  Doing = 1,
  InReview = 2,
  Paid = 3,
}
export interface NotificationsResponse<T> {
  data: T;
  count: number;
}

interface OwnerNotification {
  avatar: string,
  displayName: string
}
export interface Notification {
  _id: string;
  owner: OwnerNotification,
  created_at: Date;
}
export interface Rating {
  _id: string;
  owner_id: IMeProfile;
  task_id: string;
  bounty_task_id: string;
  user_id: string;
  rating: number;
  comment: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export interface RatingByUserTask {
  _id: string, 
  rating: number,
  comment: number
}