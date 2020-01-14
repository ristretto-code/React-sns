import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import styled from "styled-components";

const CustomSlider = styled(Slider)`
  & .slick-list {
    width: 100%;
  }
  & img {
  }
`;

const PostImages = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true
  };
  return (
    <CustomSlider {...settings}>
      {images.map((v, i) => {
        return <img key={i} src={`//localhost:8080/${v.src}`} />;
      })}
    </CustomSlider>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string
    })
  ).isRequired
};

export default PostImages;
