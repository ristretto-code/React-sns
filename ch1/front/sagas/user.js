import { all, fork, takeEvery, call, put, delay } from "redux-saga/effects";

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE
} from "../reducers/user";
import Axios from "axios";

function loginAPI() {
  // 서버에 요청을 보내는 부분
  return Axios.post("./login");
}

function* login() {
  try {
    // yield call(loginAPI); // loginAPI가 성공하면 다음줄 실행
    yield delay(2000);
    yield put({
      // put은 dispatch와 동일
      type: LOG_IN_SUCCESS
    });
  } catch (e) {
    // loginAPI가 실패
    console.log("로그인 API 불러오지 못했음");
    console.error(e);
    yield put({
      // LOG_IN_FAILURE 실행됨
      type: LOG_IN_FAILURE
    });
  }
}

function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signAPI() {
  return Axios.post("./login");
}

function* signUp() {
  try {
    // yield call(signAPI);
    yield delay(2000);
    throw new Error("에러에러에러에러");
    yield put({
      type: SIGN_UP_SUCCESS
    });
  } catch (e) {
    console.log("회원가입 API 불러오지 못했음");
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: e
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([fork(watchSignUp), fork(watchLogin)]);
}
