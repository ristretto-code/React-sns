import {
  all,
  fork,
  takeLatest, // 이전 take가 끝나지 않은게 있다면 끝나지않은 이전요청을 끝낸다. 클라이언트에서 순식간에 여러번 요청이와도 한번만 응답해줄수있다.
  takeEvery,
  call,
  put,
  take,
  delay
} from "redux-saga/effects";

import {
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE
} from "../reducers/user";

function loginAPI() {
  // 서버에 요청을 보내는 부분
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
  yield put({
    type: LOG_IN_SUCCESS
  });
}

function signAPI() {}

function* signUp() {
  try {
    yield call(signAPI);
    yield put({
      type: SIGN_UP_SUCCESS
    });
  } catch (e) {
    console.log("회원가입 API 불러오지 못했음");
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([fork(watchSignUp), fork(watchLogin)]);
}
