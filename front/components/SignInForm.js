import React, { useCallback, useState, useEffect } from "react";
import { Input, Button, Form, Icon, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LOG_IN_REQUEST } from "../reducers/user";
import SignupForm from "./SignupForm";
import Router from "next/router";
import styled from "styled-components";

export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback(e => {
    // 자식에게 전달해주는 컴포넌트는 모두 usecallback사용
    setter(e.target.value);
  }, []);
  return [value, handler, setter];
};

const LoginError = styled.div`
  color: red;
`;

const LoginSpan = styled.div`
  margin-top: 20px;
  width: 100%;
  text-align: center;
  & a {
    margin: 0 5px;
    font-weight: 600;
  }
`;

const LoginDiv = styled.div`
  margin: 8px 0;
`;

const SignInForm = ({ modalOn }) => {
  const [id, onChangeId, setId] = useInput("");
  const [password, onPassword, setPassword] = useInput("");
  const [loginModalOpen, setloginModalOpen] = useState(false);
  const [signupModalOn, setSignupModalOn] = useState(false);
  const { isLoggingIn, loginErrorReason, isLoggedIn } = useSelector(
    state => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setloginModalOpen(!loginModalOpen);
    // props가 변할때 loginModalOpen 변경
    setId("");
    setPassword("");
  }, [modalOn]);

  useEffect(() => {
    setloginModalOpen(false);
    // 컴포넌트 생성시 modalOn값이 넘어오면서 true되는것 방지
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setloginModalOpen(false);
      Router.push("/");
    }
  }, [isLoggedIn]);

  const signUpOn = useCallback(() => {
    setSignupModalOn(!signupModalOn);
    //회원가입 모달 on
    setloginModalOpen(!loginModalOpen);
    //로그인 모달 off
  });

  const handleCancel = useCallback(() => {
    setloginModalOpen(!loginModalOpen);
  });

  const onSubmitForm = useCallback(() => {
    dispatch({
      type: LOG_IN_REQUEST,
      data: {
        userId: id,
        password
      }
    });
  }, [id, password]);

  return (
    <>
      <Modal
        title="회원 로그인"
        visible={loginModalOpen}
        onOk={onSubmitForm}
        onCancel={handleCancel}
        confirmLoading={isLoggingIn}
      >
        <LoginDiv>
          <Input
            name="user-id"
            value={id}
            onChange={onChangeId}
            placeholder="이메일"
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            required
          />
        </LoginDiv>
        <LoginDiv>
          <Input
            name="user-password"
            type="password"
            value={password}
            onChange={onPassword}
            placeholder="비밀번호"
            prefix={<Icon type="key" style={{ color: "rgba(0,0,0,.25)" }} />}
            required
          />
        </LoginDiv>
        <LoginDiv>
          <LoginError>{loginErrorReason}</LoginError>
        </LoginDiv>
        <LoginSpan>
          아직 회원이 아니신가요? <a onClick={signUpOn}>회원가입</a>
        </LoginSpan>
      </Modal>
      <SignupForm modalOn={signupModalOn} />
    </>
  );
};

export default SignInForm;
