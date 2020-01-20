import React, { useCallback, useState } from "react";
import { Button, Icon, Row, Col, Avatar, Empty, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Router from "next/router";
import styled from "styled-components";
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

const { Search } = Input;

const success = confirmmsg => {
  Modal.success({
    content: confirmmsg
  });
};

const UserInfoContainer = styled.div`
  margin-bottom: 5%;
`;

const AvatarWrapper = styled.div`
  text-align: center;
`;

const NicknameWrapper = styled.div`
  margin-top: 15px;
  margin-bottom: 22px;
  font-size: 23px;
  color: #262626;
  & i {
    margin-left: 10px;
    cursor: pointer;
    color: #1864ab;
  }
  & .ant-input {
    width: max-content;
  }
`;

const UserDataWrapper = styled.div`
  margin-bottom: 22px;

  display: flex;
  font-size: 17px;
  color: #262626;
  & div {
    margin-right: 37px;
  }
  & span {
    font-weight: 600;
  }
`;

const IntroduceWrapper = styled.div`
  border: 1px solid red;
  font-size: 15px;
`;

const UserPostContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: max-content;
  flex-wrap: wrap;
  border-top: 1px solid #e6e6e6;
  padding-top: 5%;
  & a {
    color: #262626;
  }
`;

const UserInfoWrapper_M = styled.div`
  display: flex;
  justify-content: center;
  & div {
    margin-right: 20px;
  }
`;
const UserNameWrapper_M = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5%;
  font-size: 25px;

  & i {
    padding-top: 3px;
    margin-left: 10px;
    font-size: 20px;
    width: 10px;
    cursor: pointer;
  }
`;
const UserDataWrapper_M = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 3%;
  margin-top: 3%;
  border-top: 1px solid #e6e6e6;

  & div {
    font-weight: 600;
    font-size: 14px;
    text-align: center;
  }
`;

const Profile = () => {
  const dispatch = useDispatch();
  const { followingList, followerList } = useSelector(state => state.user);
  const { userPosts, isLoadingUserPost } = useSelector(state => state.post);
  const { me, isEditingNickname } = useSelector(state => state.user);
  const [editNameOn, setEditNameOn] = useState(false);
  const [editedName, setEditedName] = useState("");

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
      <UserInfoContainer>
        <Row>
          <Col xs={0} md={8}>
            <AvatarWrapper>
              <Avatar
                size={150}
                icon="user"
                style={{
                  backgroundColor: "#87d068"
                }}
              />
            </AvatarWrapper>
          </Col>
          <Col xs={0} md={16}>
            <NicknameWrapper>
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
            </NicknameWrapper>
            <UserDataWrapper>
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
            </UserDataWrapper>
            <IntroduceWrapper>
              <div>{`안녕하세요? ${me.nickname} 입니다`}</div>
            </IntroduceWrapper>
          </Col>
          <Col xs={24} md={0}>
            <UserInfoWrapper_M>
              <div>
                <Avatar
                  size={80}
                  icon="user"
                  style={{
                    backgroundColor: "#87d068"
                  }}
                />
              </div>
              <div>
                <UserNameWrapper_M>
                  {me && me.nickname}
                  {me ? <Icon type="logout" onClick={onLogout} /> : null}
                </UserNameWrapper_M>
                <div>{`안녕하세요? ${me.nickname} 입니다`}</div>
              </div>
            </UserInfoWrapper_M>
            <UserDataWrapper_M>
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
            </UserDataWrapper_M>
          </Col>
        </Row>
      </UserInfoContainer>
      <UserPostContainer>
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
      </UserPostContainer>
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
