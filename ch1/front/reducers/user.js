const dummyUser = {
  Nickname: "IANCHOI",
  Post: [],
  Followings: [],
  Followers: [],
  signUpData: {}
};

export const initialState = {
  isLoggedIn: false,
  user: null
};

export const SIGN_UP = "SIGN_UP";
export const LOG_IN = "LOG_IN"; // 액션의 이름
export const LOG_OUT = "LOG_OUT";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const signUpAction = data => {
  return {
    type: SIGN_UP,
    data: data
  };
};
export const loginAction = {
  type: LOG_IN,
  data: {
    nickname: "철웅쓰"
  }
};

export const logoutAction = {
  type: LOG_OUT
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN: {
      return {
        ...state,
        isLoggedIn: true,
        user: dummyUser
      };
    }
    case LOG_OUT: {
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };
    }
    case SIGN_UP: {
      return {
        ...state,
        signUpData: action.data
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state
      };
    }

    case LOG_IN_SUCCESS: {
      return {
        ...state
      };
    }
    default: {
      return {
        ...state
      };
    }
  }
};
