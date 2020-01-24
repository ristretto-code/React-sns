import React from "react";
import { useSelector } from "react-redux";
import { LOAD_USER_POSTS_REQUEST } from "../reducers/post";
import { LOAD_USER_REQUEST } from "../reducers/user";
import { Avatar, Row, Col, Icon, Empty } from "antd";
import UserPost from "../containers/UserPost";
import * as profile from "../elements/profile";

const User = () => {
  const { userPosts, isLoadingUserPost } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.user);

  return (
    <div>
      <profile.UserInfoContainer>
        {userInfo ? (
          <Row>
            <Col xs={0} md={8}>
              <profile.AvatarWrapper>
                <Avatar
                  size={150}
                  icon="user"
                  style={{
                    backgroundColor: userInfo && userInfo.profileColor
                  }}
                />
              </profile.AvatarWrapper>
            </Col>
            <Col xs={0} md={16}>
              <profile.NicknameWrapper>
                {userInfo && userInfo.nickname}
              </profile.NicknameWrapper>
              <profile.UserDataWrapper>
                <div>
                  게시물 <span>{userInfo && userInfo.Posts}</span>
                </div>
                <div>
                  팔로워 <span>{userInfo && userInfo.Followers}</span>
                </div>
                <div>
                  팔로우 <span>{userInfo && userInfo.Followings}</span>
                </div>
              </profile.UserDataWrapper>
              <profile.IntroduceWrapper>
                <div>{`안녕하세요? ${userInfo &&
                  userInfo.nickname} 입니다`}</div>
              </profile.IntroduceWrapper>
            </Col>
            <Col xs={24} md={0}>
              <profile.UserInfoWrapper_M>
                <div>
                  <Avatar
                    size={80}
                    icon="user"
                    style={{
                      backgroundColor: userInfo && userInfo.profileColor
                    }}
                  />
                </div>
                <div>
                  <profile.UserNameWrapper_M>
                    {userInfo && userInfo.nickname}
                  </profile.UserNameWrapper_M>
                  <div>{`안녕하세요? ${userInfo.nickname} 입니다`}</div>
                </div>
              </profile.UserInfoWrapper_M>
              <profile.UserDataWrapper_M>
                <div>
                  게시물 <div>{userInfo && userInfo.Posts}</div>
                </div>
                <div>
                  팔로워 <div>{userInfo && userInfo.Followers}</div>
                </div>
                <div>
                  팔로우 <div>{userInfo && userInfo.Followings}</div>
                </div>
              </profile.UserDataWrapper_M>
            </Col>
          </Row>
        ) : null}
      </profile.UserInfoContainer>
      {isLoadingUserPost ? (
        userPosts.length ? (
          userPosts.map(v => {
            return <UserPost key={v.id} Post={v} />;
          })
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No Data</span>}
          ></Empty>
        )
      ) : (
        <Icon style={{ fontSize: "50px" }} type="loading" />
      )}
    </div>
  );
};

User.getInitialProps = async context => {
  const id = parseInt(context.query.id, 10);
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: id
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: id
  });
  return { id };
};

export default User;
