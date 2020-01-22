import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";

const PostImages = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true
  };
  return (
    <Slider {...settings}>
      {images.map((v, i) => {
        return <img key={i} src={v.src} />;
      })}
    </Slider>
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
