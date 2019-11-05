import React, { useEffect } from "react";
import Link from "next/link";
import propTypes from "prop-types";
import { Menu, Input, Button, Row, Col, Card, Avatar } from "antd";
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { LOAD_USER_REQUEST } from "../reducers/user";

const AppLayout = ({ children }) => {
  const { isLoggedIn, me } = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!me) {
      dispatch({ type: LOAD_USER_REQUEST });
    }
  }, []);
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>홈</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>
      </Menu>

      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
          <Link href="/signup">
            <a>
              <Button>회원가입</Button>
            </a>
          </Link>
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <Link href="">
            <a target="_blank">made by IANCHOI</a>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: propTypes.node
};

export default AppLayout;
