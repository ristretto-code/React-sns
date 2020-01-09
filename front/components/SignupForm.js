import React, { useState, useCallback, useEffect } from "react";
import { Input, Modal, Icon } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducers/user";
import { useInput } from "./SignInForm";
import styled from "styled-components";

const SignupError = styled.div`
  color: red;
`;

const SignDiv = styled.div`
  margin: 10px 0;
`;

const SignupForm = ({ signupModalOn }) => {
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [id, onChangeId] = useInput("");
  const [nick, onChangeNick] = useInput("");
  const [password, onChangePassword] = useInput("");
  const dispatch = useDispatch();
  const { isSigningUp, isSignedUp, signUpErrorReason } = useSelector(
    state => state.user
  );

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(!modalOpen);
  }, [signupModalOn]);

  useEffect(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (isSignedUp) {
      setModalOpen(false);
    }
  }, [isSignedUp]);

  const handleCancel = useCallback(() => {
    setModalOpen(!modalOpen);
  });

  const onSubmitForm = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    return dispatch({
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
      visible={modalOpen}
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
        <SignupError>{signUpErrorReason}</SignupError>
      </SignDiv>
    </Modal>
  );
};

export default SignupForm;
