import React, { useCallback } from "react";
import { Input, Button, Form } from "antd";
import { useInput } from "../pages/signup";

const LoginForm = () => {
  const [id, onChangeId] = useInput("");
  const [password, onPassword] = useInput("");
  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();
      console.log({
        id,
        password
      });
    },
    [id, password]
  );

  return (
    <Form onSubmit={onSubmitForm}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onPassword}
          required
        />
      </div>
      <div style={{ marginTop: "10" }}>
        <Button type="primary" htmlType="submit" loading={false}>
          로그인
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
