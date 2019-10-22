const dummyUser = {
  Nickname: "IANCHOI",
  Post: [],
  Followings: [],
  Followers: [],
  signUpData: {}
};

export const initialState = {
  isLoggedIn: false,
  isLoadding: false,
  user: null
};

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const signUpAction = data => {
  return {
    type: SIGN_UP_REQUEST,
    data: data
  };
};

export const signUpSuccess = {
  type: SIGN_UP_SUCCESS
};

export const loginAction = data => {
  return {
    type: LOG_IN_REQUEST,
    data
  };
};

export const logoutAction = {
  type: LOG_OUT_REQUEST
};

export const signUp = data => {
  return {
    type: SIGN_UP_REQUEST,
    data
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggedIn: true,
        isLoadding: true,
        user: dummyUser
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoadding: false
      };
    }
    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggedIn: false,
        isLoadding: true,
        user: null
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoadding: false
      };
    }
    case SIGN_UP_REQUEST: {
      return {
        ...state,
        isLoadding: true,
        signUpData: action.data
      };
    }
    case LOG_IN_FAILURE: {
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
