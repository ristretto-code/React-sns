import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducers/user";

const UserProfile = () => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const onLogout = useCallback(e => {
    e.preventDefault();
    dispatch({
      type: LOG_OUT_REQUEST
    });
  }, []);
  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {me.Post.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key="followers">
          팔로워
          <br />
          {me.Followers.length}
        </div>
      ]}
    >
      <Card.Meta avatar={<Avatar>{me.nickname}</Avatar>} title={me.nickname} />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
