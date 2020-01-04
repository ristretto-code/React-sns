import React, { useCallback } from "react";
import { Input, Button, Form, Icon } from "antd";
import { useInput } from "../pages/signup";
import { useDispatch, useSelector } from "react-redux";
import { LOG_IN_REQUEST } from "../reducers/user";
import styled from "styled-components";

const LoginError = styled.div`
  color: red;
`;

const LoginForm = () => {
  const [id, onChangeId] = useInput("");
  const [password, onPassword] = useInput("");
  const { isLoggingIn, loginErrorReason } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();
      dispatch({
        type: LOG_IN_REQUEST,
        data: {
          userId: id,
          password
        }
      });
    },
    [id, password]
  );

  return (
    <Form onSubmit={onSubmitForm}>
      <div>
        <Input
          name="user-id"
          value={id}
          onChange={onChangeId}
          placeholder="이메일"
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          required
        />
      </div>
      <div>
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onPassword}
          placeholder="비밀번호"
          prefix={<Icon type="key" style={{ color: "rgba(0,0,0,.25)" }} />}
          required
        />
      </div>
      <LoginError>{loginErrorReason}</LoginError>
      <div style={{ marginTop: "10" }}>
        <Button type="primary" htmlType="submit" loading={isLoggingIn} block>
          로그인
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
