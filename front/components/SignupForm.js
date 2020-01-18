import React, { useState, useCallback, useEffect } from "react";
import { Input, Modal, Icon } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST, LOG_IN_REQUEST } from "../reducers/user";
import { useInput } from "./SignInForm";
import Router from "next/router";
import styled from "styled-components";

const SignupError = styled.div`
  color: red;
`;

const SignDiv = styled.div`
  margin: 10px 0;
`;

const SignupForm = ({ modalOn }) => {
  const dispatch = useDispatch();
  const [id, onChangeId, setId] = useInput("");
  const [nick, onChangeNick, setNick] = useInput("");
  const [password, onChangePassword, setPassword] = useInput("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const { isSigningUp, isSignedUp, signUpErrorReason } = useSelector(
    state => state.user
  );

  const [signupModalOpen, setSignupModalOpen] = useState(false);

  useEffect(() => {
    setSignupModalOpen(!signupModalOpen);
    setId("");
    setNick("");
    setPassword("");
    setPasswordCheck("");
    setPasswordError(false);
  }, [modalOn]);

  useEffect(() => {
    setSignupModalOpen(false);
    // 컴포넌트 생성시 modalOn값이 넘어오면서 true되는것 방지
  }, []);

  useEffect(() => {
    if (isSignedUp) {
      dispatch({
        type: LOG_IN_REQUEST,
        data: {
          userId: id,
          password
        }
      }); // 회원가입 성공시 자동로그인
      Modal.success({
        title: "회원가입 성공",
        onOk() {
          setSignupModalOpen(false);
          Modal.destroyAll();
          Router.push("/");
        }
      }); // 성공모달창 닫을시 index로 이동
    }
  }, [isSignedUp]);

  useEffect(() => {
    if (signUpErrorReason) {
      Modal.error({
        title: "회원가입 실패",
        content: signUpErrorReason
      });
    }
  }, [signUpErrorReason]);

  const handleCancel = useCallback(() => {
    setSignupModalOpen(!signupModalOpen);
  });

  const onSubmitForm = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        userId: id,
        password,
        nickname: nick
      }
    });
  }, [id, nick, password, passwordCheck]);

  const onChangePasswordCheck = useCallback(
    e => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password]
  );

  return (
    <Modal
      title="회원 가입"
      visible={signupModalOpen}
      onOk={onSubmitForm}
      onCancel={handleCancel}
      confirmLoading={isSigningUp}
    >
      <SignDiv>
        <Input
          name="user-id"
          value={id}
          required
          onChange={onChangeId}
          placeholder="아이디"
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
        />
      </SignDiv>
      <SignDiv>
        <Input
          name="user-nick"
          value={nick}
          required
          onChange={onChangeNick}
          placeholder="닉네임"
          prefix={<Icon type="smile" style={{ color: "rgba(0,0,0,.25)" }} />}
        />
      </SignDiv>
      <SignDiv>
        <Input
          name="user-pass"
          type="password"
          value={password}
          required
          onChange={onChangePassword}
          placeholder="패스워드"
          prefix={<Icon type="key" style={{ color: "rgba(0,0,0,.25)" }} />}
        />
      </SignDiv>
      <SignDiv>
        <Input
          name="user-pass-chk"
          type="password"
          value={passwordCheck}
          required
          onChange={onChangePasswordCheck}
          placeholder="패스워드 확인"
          prefix={<Icon type="key" style={{ color: "rgba(0,0,0,.25)" }} />}
        />
        {passwordError && (
          <SignupError> 패스워드가 일치하지 않습니다</SignupError>
        )}
      </SignDiv>
    </Modal>
  );
};

export default SignupForm;
