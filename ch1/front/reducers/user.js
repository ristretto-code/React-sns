import { elementType } from "prop-types";

export const initialState = {
  isLoggedIn: false,
  user: {}
};

const LOG_IN = "LOG_IN"; // 액션의 이름
const LOG_OUT = "LOG_OUT";

const loginAction = {
  type: LOG_IN,
  data: {
    nickname: "철웅쓰"
  }
};

const logoutAction = {
  type: LOG_OUT
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default: {
      return {
        ...state
      };
    }
    case loginAction: {
      return {
        ...state,
        isLoggedIn: true,
        user: action.data
      };
    }
    case logoutAction: {
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };
    }
  }
};

export default reducer;
