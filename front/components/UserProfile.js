import React, { useCallback } from "react";
import Link from "next/link";
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
        <Link href="/profile" key="twit">
          <a>
            <div>
              포스트
              <br />
              {me.Posts ? me.Posts.length : 0}
            </div>{" "}
          </a>
        </Link>,
        <Link href="/profile" key="followings">
          <div>
            팔로잉
            <br />
            {me.Followings ? me.Followings.length : 0}
          </div>
        </Link>,
        <Link href="/profile" key="followers">
          <div>
            팔로워
            <br />
            {me.Followers ? me.Followers.length : 0}
          </div>
        </Link>
      ]}
    >
      <Card.Meta avatar={<Avatar>{me.nickname}</Avatar>} title={me.nickname} />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
