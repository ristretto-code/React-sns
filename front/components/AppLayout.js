import React, { useState, useCallback } from "react";
import Link from "next/link";
import propTypes from "prop-types";
import { Layout, Input, Button, Row, Col, Affix } from "antd";
import SignInForm from "./SignInForm";
import { useSelector } from "react-redux";
import Router from "next/router";
import styled from "styled-components";

const { Header, Content, Footer } = Layout;

const Logo = styled.img`
  height: 5vh;
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 935px;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 935px;
`;

const ButtonWrapper = styled.div`
  text-align: end;
  & button {
    margin-right: 12%;
  }
`;

const CopyRight = styled.div`
  margin: 20px 0;
  text-align: center;
  color: #9d9d9d;
  & a {
    color: #9d9d9d;
  }
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
            display: "flex",
            justifyContent: "center",
            padding: "0 10px 0 15px"
          }}
        >
          <HeaderContainer>
            <Row type="flex" justify="space-between">
              <Col xs={12} sm={6}>
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
              <Col xs={0} sm={6}>
                <ButtonWrapper>
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
                </ButtonWrapper>
              </Col>
              <Col xs={12} sm={0}>
                <ButtonWrapper>
                  {me ? (
                    <>
                      <Link href="/postup">
                        <a>
                          <Button
                            shape="circle"
                            size="large"
                            icon="plus"
                          ></Button>
                        </a>
                      </Link>
                      <Link href="/profile">
                        <a>
                          <Button
                            shape="circle"
                            size="large"
                            icon="user"
                          ></Button>
                        </a>
                      </Link>
                    </>
                  ) : (
                    <Button type="link" onClick={signModal}>
                      Sign In
                    </Button>
                  )}
                </ButtonWrapper>
              </Col>
            </Row>
          </HeaderContainer>
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
      <Footer style={{ minHeight: "5vh" }}>
        <CopyRight>
          <Link href="//github.com/ristretto-code/React-sns" prefetch={false}>
            <a target="_blank">2020 IAN CHOI</a>
          </Link>
        </CopyRight>
      </Footer>
    </Layout>
  );
};

AppLayout.propTypes = {
  children: propTypes.node
};

export default AppLayout;
