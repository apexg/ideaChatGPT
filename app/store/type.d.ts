export type UserType = {
  corpid: string;
  username: string;
  alias_name: string;  
  mobile: string;
  email: string;
  loginTime: number;
  userCode:string;
};

export type RequestLog = {
  username: string;
  request_time: number;
};
