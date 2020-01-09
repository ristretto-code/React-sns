import React, { useCallback, useState, useEffect } from "react";
import { Input, Button, Form, Icon, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LOG_IN_REQUEST } from "../reducers/user";
import SignupForm from "./SignupForm";
import styled from "styled-components";

export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback(e => {
    // 자식에게 전달해주는 컴포넌트는 모두 usecallback사용
    setter(e.target.value);
  }, []);
  return [value, handler];
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

const SignInForm = ({ signModalOn }) => {
  const [id, onChangeId] = useInput("");
  const [password, onPassword] = useInput("");
  const [modalOpen, setModalOpen] = useState(false);
  const [signupModalOn, setSignupModalOn] = useState(false);
  const { isLoggingIn, loginErrorReason, isLoggedIn } = useSelector(
    state => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setModalOpen(!modalOpen);
  }, [signModalOn]);

  useEffect(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setModalOpen(false);
    }
  }, [isLoggedIn]);

  const signUpOn = useCallback(() => {
    console.log("회원가입창으로 전환");
    setSignupModalOn(!signupModalOn);
  });

  const handleCancel = useCallback(() => {
    setModalOpen(!modalOpen);
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
        visible={modalOpen}
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
      <SignupForm signupModalOn={signupModalOn} />
    </>
  );
};

export default SignInForm;
