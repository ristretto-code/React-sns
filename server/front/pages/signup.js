import React, { useState, useCallback, useEffect } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { SIGN_UP_REQUEST } from "../reducers/user";

export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback(e => {
    // 자식에게 전달해주는 컴포넌트는 모두 usecallback사용
    setter(e.target.value);
  }, []);
  return [value, handler];
};

const Signup = () => {
  const [passwordCheck, setPasswordCheck] = useState("");
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [id, onChangeId] = useInput("");
  const [nick, onChangeNick] = useInput("");
  const [password, onChangePassword] = useInput("");
  const dispatch = useDispatch();
  const { isSigningUp, me } = useSelector(state => state.user);

  useEffect(() => {
    if (me) {
      alert("로그인했으니 메인페이지로 이동합니다");
      Router.push("/");
    }
  }, [me && me.id]);

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      if (password !== passwordCheck) {
        return setPasswordError(true);
      }
      if (!term) {
        return setTermError(true);
      }
      dispatch({
        type: SIGN_UP_REQUEST,
        data: {
          id,
          password,
          nick
        }
      });
    },
    [id, nick, password, passwordCheck, term]
  );

  const onChangePasswordCheck = useCallback(
    e => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password]
  );
  const onChangeTerm = useCallback(e => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input
            name="user-nick"
            value={nick}
            required
            onChange={onChangeNick}
          />
        </div>
        <div>
          <label htmlFor="user-pass">패스워드</label>
          <br />
          <Input
            name="user-pass"
            type="password"
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-pass-chk">패스워드</label>
          <br />
          <Input
            name="user-pass-chk"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <div style={{ color: "red" }}>비밀번호 일치하지 않음</div>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            유저 동의
          </Checkbox>
          {termError && <div style={{ color: "red" }}>약관동의필요</div>}
        </div>
        <div style={{ margin: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}>
            가입하기
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;
