import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, Avatar, Button, List } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducers/user";
import styled from "styled-components";

const MyPostListContainer = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background-color: #ffffff;
  height: 300px;
`;
const MyPostList = styled.div`
  overflow: auto;
  padding: 8px 12px 8px 0px;
  height: 85%;
`;
const MyPostListHeader = styled.div`
  padding: 15px;
  height: 15%;
`;

const UserProfile = () => {
  const [guestNum, setGuestNum] = useState("");

  useEffect(() => {
    const rannum = Math.floor(Math.random() * 100000) - 1;
    setGuestNum(rannum);
  }, []);

  const { me } = useSelector(state => state.user);
  const { userPosts } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const onLogout = useCallback(e => {
    e.preventDefault();
    dispatch({
      type: LOG_OUT_REQUEST
    });
  }, []);

  return (
    <>
      <div>
        {me ? (
          <Link href="/profile" key="profile">
            <a>
              <Avatar size={55} icon="user" />
            </a>
          </Link>
        ) : (
          <Avatar>G</Avatar>
        )}
        <Link href="/profile" key="profile2">
          <a>{me ? me.nickname : "Guest " + guestNum}</a>
        </Link>
        {me ? <Button onClick={onLogout}>로그아웃</Button> : null}
      </div>
      <Link href="/postup" key="post">
        <a>
          <Button
            type="dashed"
            icon="plus"
            style={{ height: "40px", fontSize: "25px", color: "#CCCCCC" }}
            block
          ></Button>
        </a>
      </Link>

      {me ? (
        <MyPostListContainer>
          <MyPostListHeader>나의 게시물</MyPostListHeader>
          <MyPostList>
            <List
              dataSource={userPosts}
              renderItem={item => (
                <Link
                  href={{ pathname: "/post", query: { id: item.id } }}
                  as={`/post/${item.id}`}
                >
                  <a>
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size={60}
                            shape="square"
                            src={
                              item.Images[0]
                                ? `http://localhost:8080/${item.Images[0].src}`
                                : null
                            }
                            icon="picture"
                          />
                        }
                        title={item.createdAt}
                        description={item.content}
                      />
                    </List.Item>
                  </a>
                </Link>
              )}
            ></List>
          </MyPostList>
        </MyPostListContainer>
      ) : null}
    </>
  );
};

export default UserProfile;
