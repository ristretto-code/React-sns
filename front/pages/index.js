import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PostCard from "../components/PostCard";
import UserProfile from "../components/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Affix } from "antd";
import {
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_USER_POSTS_REQUEST
} from "../reducers/post";
import styled from "styled-components";

const ProfileWrapper = styled.div`
  margin: 0 8%;
`;

const CopyRight = styled.div`
  height: 300px;
  text-align: center;
  vertical-align: middle;
  color: #fafafa;
`;

const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]);

  const onScroll = useCallback(() => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1].id;
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId: lastId
          });
          countRef.current.push(lastId);
          // dispatch 중복실행 막기
          // saga에서는 쓰로틀링으로 막고있음
        }
      }
    }
  }, [mainPosts.length, hasMorePost]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts]); // 강력한 캐싱 방지

  return (
    <>
      <Row type="flex" justify="center">
        <Col xs={24} md={15}>
          {mainPosts &&
            mainPosts.map(c => {
              return <PostCard key={c.id} post={c} />;
            })}
        </Col>
        <Col xs={0} md={9}>
          <Affix offsetTop={90}>
            <ProfileWrapper>
              <UserProfile />
              <CopyRight>
                <Link
                  href="//github.com/ristretto-code/React-sns"
                  prefetch={false}
                >
                  <a target="_blank">2019 IAN CHOI</a>
                </Link>
              </CopyRight>
            </ProfileWrapper>
          </Affix>
        </Col>
      </Row>
    </>
  );
};

Home.getInitialProps = async context => {
  // console.log(Object.keys(context));
  const state = context.store.getState();
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id
  });
};

export default Home;
