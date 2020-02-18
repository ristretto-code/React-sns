import { all, fork } from "redux-saga/effects";
import user from "./user";
import post from "./post";
import axios from "axios";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.reactsns.net"
    : "https://api.reactsns.net";

axios.defaults.baseURL = `${apiUrl}/api`;

export default function* rootSaga() {
  yield all([fork(user), fork(post)]);
}
