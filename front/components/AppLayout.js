import React, { useState, useCallback } from "react";
import Link from "next/link";
import propTypes from "prop-types";
import { Layout, Input, Button, Row, Col, Affix, Icon, Menu } from "antd";
import SignInForm from "./SignInForm";
import { useSelector } from "react-redux";
import Router from "next/router";
import styled from "styled-components";

const { Header, Content, Footer } = Layout;

const Logo = styled.img`
  height: 5vh;
`;

const ContentContainer = styled.div`
  width: 100%;
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
    <Layout style={{}}>
      <Affix offsetTop={0}>
        <Header
          style={{
            textAlign: "center"
          }}
        >
          <Row type="flex" justify="space-between">
            <Col>
              <Link href="/">
                <a>
                  <Logo src={"//localhost:3000/logo.png"} />
                </a>
              </Link>
            </Col>
            <Col xs={0} sm={12}>
              <Input.Search
                placeholder={"태그 검색"}
                onSearch={onSearch}
                size="default"
                style={{ maxWidth: "500px", height: "5vh" }}
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
      <Content
        style={{
          minHeight: "80vh",
          marginTop: "7vh",
          display: "flex",
          justifyContent: "center"
        }}
      >
        {<SignInForm modalOn={signModalOn} />}
        <ContentContainer>{children}</ContentContainer>
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
