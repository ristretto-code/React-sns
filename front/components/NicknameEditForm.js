import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Modal } from "antd";
import { EDIT_NICKNAME_REQUEST } from "../reducers/user";

const error = errormsg => {
  Modal.error({
    title: "에러 메세지",
    content: errormsg
  });
};

const success = confirmmsg => {
  Modal.success({
    content: confirmmsg
  });
};

const NicknameEditForm = () => {
  const [editedName, setEditedName] = useState("");
  const dispatch = useDispatch();
  const { me, isEditingNickname } = useSelector(state => state.user);

  const onChangeNickname = useCallback(e => {
    setEditedName(e.target.value);
  }, []);

  const onEditNickname = useCallback(
    e => {
      e.preventDefault();
      if (editedName.length > 20) {
        return error("20자 이상의 닉네임은 사용할 수 없습니다");
      }
      dispatch({
        type: EDIT_NICKNAME_REQUEST,
        data: editedName
      });
      setEditedName("");
      success("수정 완료");
    },
    [editedName]
  );

  return (
    <Form
      style={{
        marginBottom: "20px",
        border: "1px solid #d9d9d9",
        padding: "20px"
      }}
      onSubmit={onEditNickname}
    >
      <Input
        addonBefore="닉네임"
        value={editedName}
        placeholder={me && me.nickname}
        onChange={onChangeNickname}
      />
      <Button type="primary" htmlType="submit" loading={isEditingNickname}>
        수정
      </Button>
    </Form>
  );
};

export default NicknameEditForm;
