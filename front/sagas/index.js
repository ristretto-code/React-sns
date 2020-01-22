import { all, fork } from "redux-saga/effects";
import user from "./user";
import post from "./post";
import axios from "axios";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "http://api.reactsns.net"
    : "http://localhost:8080";

axios.defaults.baseURL = `${apiUrl}/api`;

export default function* rootSaga() {
  yield all([fork(user), fork(post)]);
}
