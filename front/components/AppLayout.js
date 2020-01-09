import React, { useState, useCallback } from "react";
import Link from "next/link";
import propTypes from "prop-types";
import { Layout, Input, Button, Row, Col, Affix, Icon, Menu } from "antd";
import SignInForm from "./SignInForm";
import { useSelector } from "react-redux";
import Router from "next/router";
import styled from "styled-components";

const { Header, Content, Footer } = Layout;

const Logo = styled.div`
  width: 100px;
  height: 100%;
  background-color: green;
  border: 1px solid red;
`;

const ContentContainer = styled.div`
  max-width: 935px;
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector(state => state.user);
  const [signModalOn, setSignModalOn] = useState(false);
  const signModal = useCallback(() => {
    setSignModalOn(!signModalOn);
  });

  const onSearch = value => {
    Router.push(
      { pathname: "/hashtag", query: { tag: value } },
      `/hashtag/${value}`
    );
  };

  return (
    <Layout>
      <Affix offsetTop={0}>
        <Header
          style={{
            textAlign: "center",
            minHeight: "5vh"
          }}
        >
          <Row type="flex" justify="space-between">
            <Col>
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
            </Col>
            <Col xs={0} sm={12}>
              <Input.Search
                placeholder={"태그 검색"}
                style={{ verticalAlign: "middle" }}
                onSearch={onSearch}
                size="default"
                style={{ maxWidth: "500px", margin: "10px 0" }}
              />
            </Col>
            <Col>
              {me ? (
                <Link href="/profile">
                  <a>
                    <Button icon="user">Profile</Button>
                  </a>
                </Link>
              ) : (
                <Button type="link" onClick={signModal}>
                  Sign In
                </Button>
              )}
            </Col>
          </Row>
        </Header>
      </Affix>
      <Content style={{ minHeight: "80vh", marginTop: "5vh" }}>
        {<SignInForm signModalOn={signModalOn} />}
        <Row type="flex" justify="center">
          <Col>
            <ContentContainer>{children}</ContentContainer>
          </Col>
        </Row>
      </Content>
      <Footer style={{ minHeight: "5vh", textAlign: "center" }}>
        2019 IAN CHOI
      </Footer>
    </Layout>
  );
};

AppLayout.propTypes = {
  children: propTypes.node
};

export default AppLayout;
