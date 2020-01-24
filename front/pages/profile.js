import React, { useCallback, useState, useEffect } from "react";
import { Button, Icon, Row, Col, Avatar, Empty, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Router from "next/router";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
  EDIT_NICKNAME_REQUEST,
  LOG_OUT_REQUEST
} from "../reducers/user";
import { LOAD_USER_POSTS_REQUEST } from "../reducers/post";
import UserPost from "../containers/UserPost";
import * as profile from "../elements/profile";

const { Search } = Input;

const success = confirmmsg => {
  Modal.success({
    content: confirmmsg
  });
};

const Profile = () => {
  const dispatch = useDispatch();
  const { followingList, followerList } = useSelector(state => state.user);
  const { userPosts, isLoadingUserPost } = useSelector(state => state.post);
  const { me, isEditingNickname } = useSelector(state => state.user);
  const [editNameOn, setEditNameOn] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (!me) {
      Modal.error({
        title: "에러 메세지",
        content: "로그인이 필요합니다"
      });
      Router.push("/");
    }
  }, []);

  const onChangeNickname = useCallback(e => {
    setEditedName(e.target.value);
  }, []);

  const onUnfollow = useCallback(
    userId => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId
      });
    },
    []
  );

  const onRemoveFollower = useCallback(
    userId => () => {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: userId
      });
    },
    []
  );

  const nickChangeOn = useCallback(() => {
    setEditNameOn(!editNameOn);
  }, []);

  const onEditNickname = useCallback(() => {
    if (editedName.length > 20) {
      return error("20자 이상의 닉네임은 사용할 수 없습니다");
    }
    dispatch({
      type: EDIT_NICKNAME_REQUEST,
      data: editedName
    });
    setEditNameOn(!editNameOn);
    success("수정 완료");
  }, [editedName]);

  const onLogout = useCallback(e => {
    e.preventDefault();
    Router.push("/");
    dispatch({
      type: LOG_OUT_REQUEST
    });
  }, []);

  return (
    <>
      <profile.UserInfoContainer>
        <Row>
          <Col xs={0} md={8}>
            <profile.AvatarWrapper>
              <Avatar
                size={150}
                icon="user"
                style={{
                  backgroundColor: me && me.profileColor
                }}
              />
            </profile.AvatarWrapper>
          </Col>
          <Col xs={0} md={16}>
            <profile.NicknameWrapper>
              {editNameOn ? (
                <Search
                  maxLength={20}
                  defaultValue={me && me.nickname}
                  value={editedName}
                  onChange={onChangeNickname}
                  onSearch={onEditNickname}
                  style={{ width: 200 }}
                  enterButton="수정"
                  loading={isEditingNickname}
                />
              ) : (
                <>
                  <>{me && me.nickname}</>
                  <Icon type="edit" onClick={nickChangeOn}></Icon>
                </>
              )}
            </profile.NicknameWrapper>
            <profile.UserDataWrapper>
              <div>
                게시물 <span>{me && me.Posts ? me.Posts.length : 0}</span>
              </div>
              <div>
                팔로워{" "}
                <span>{me && me.Followers ? me.Followers.length : 0}</span>
              </div>
              <div>
                팔로우{" "}
                <span>{me && me.Followings ? me.Followings.length : 0}</span>
              </div>
            </profile.UserDataWrapper>
            <profile.IntroduceWrapper>
              <div>{`안녕하세요? ${me && me.nickname} 입니다`}</div>
            </profile.IntroduceWrapper>
          </Col>
          <Col xs={24} md={0}>
            <profile.UserInfoWrapper_M>
              <div>
                <Avatar
                  size={80}
                  icon="user"
                  style={{
                    backgroundColor: me && me.profileColor
                  }}
                />
              </div>
              <div>
                <profile.UserNameWrapper_M>
                  {me && me.nickname}
                  {me ? <Icon type="logout" onClick={onLogout} /> : null}
                </profile.UserNameWrapper_M>
                <div>{`안녕하세요? ${me && me.nickname} 입니다`}</div>
              </div>
            </profile.UserInfoWrapper_M>
            <profile.UserDataWrapper_M>
              <div>
                게시물 <div>{me && me.Posts ? me.Posts.length : 0}</div>
              </div>
              <div>
                팔로워 <div>{me && me.Followers ? me.Followers.length : 0}</div>
              </div>
              <div>
                팔로우{" "}
                <div>{me && me.Followings ? me.Followings.length : 0}</div>
              </div>
            </profile.UserDataWrapper_M>
          </Col>
        </Row>
      </profile.UserInfoContainer>
      <profile.UserPostContainer>
        {isLoadingUserPost ? (
          userPosts.length ? (
            userPosts.map((v, i) => {
              return <UserPost key={i} Post={v} />;
            })
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>No Data</span>}
            >
              <Link href="/postup">
                <a>
                  <Button type="primary">지금 쓰기</Button>
                </a>
              </Link>
            </Empty>
          )
        ) : (
          <Icon style={{ fontSize: "50px" }} type="loading" />
        )}
      </profile.UserPostContainer>
    </>
  );
};

Profile.getInitialProps = async context => {
  const state = context.store.getState();
  // load_users_request 실행. state.me is undefined.
  context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: state.user.me && state.user.me.id
  });
  context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: state.user.me && state.user.me.id
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id
  });
  // load_users_success 실행. state.me 생성
  // me가 undefined일시 '내계정으로 판단'
};

export default Profile;
