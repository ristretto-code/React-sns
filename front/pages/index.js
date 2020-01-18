import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PostCard from "../components/PostCard";
import UserProfile from "../components/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Affix } from "antd";
import {
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_USER_POSTS_REQUEST,
  INIT_STATE_POST
} from "../reducers/post";
import { INIT_STATE_USER } from "../reducers/user";
import styled from "styled-components";

const ProfileWrapper = styled.div`
  margin: 0 8%;
`;

const CopyRight = styled.div`
  height: 300px;
  margin-top: 20px;
  text-align: center;
  vertical-align: middle;
  font-size: 11px;
  color: #9d9d9d;
  & a {
    color: #9d9d9d;
  }
`;

const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]);

  const onScroll = useCallback(() => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 400
    ) {
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1].id;
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId: lastId
          });
          countRef.current.push(lastId);
          // ref에 저장해서 dispatch 중복실행 막기
          // saga에서는 쓰로틀링으로 막고있음
        }
      }
    }
  }, [mainPosts.length, hasMorePost]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      countRef.current.length = 0; // countRef 초기화(index이동시 무한스크롤 안되는것 방지)
    };
  }, [mainPosts.length]); // 강력한 캐싱 방지

  useEffect(() => {
    dispatch({
      type: INIT_STATE_POST
    });
    dispatch({
      type: INIT_STATE_USER
    });
  }, []);

  return (
    <Row>
      <Col xs={24} md={15}>
        {mainPosts &&
          mainPosts.map(c => {
            return <PostCard key={c.id} post={c} />;
          })}
      </Col>
      <Col xs={0} md={9}>
        <Affix offsetTop={80}>
          <ProfileWrapper>
            <UserProfile />
            <CopyRight>
              <Link
                href="//github.com/ristretto-code/React-sns"
                prefetch={false}
              >
                <a target="_blank">
                  <div>본 웹사이트는 포트폴리오용으로 제작되었습니다</div>
                  2020 IAN CHOI
                </a>
              </Link>
            </CopyRight>
          </ProfileWrapper>
        </Affix>
      </Col>
    </Row>
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
