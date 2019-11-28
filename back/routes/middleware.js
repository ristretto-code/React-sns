exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    //req.user 확인
    next(); // 다음 미들웨어로 넘김 e넣으면 express next가 제공하는 에러처리로 넘어감
  } else {
    res.status(401).send("로그인이 필요합니다");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인한 사용자는 접근할 수 없습니다");
  }
};
