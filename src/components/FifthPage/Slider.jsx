import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { frontendCourses, backendCourses, generalCourses, fullstackCourses } from "../../path/images";
import { useState, useEffect, useRef } from "react";
import Spinner from "../CommonUiComponents/Spinner";
import { CustomNextArrow, CustomPrevArrow } from "../CommonUiComponents/CustomArrows";
import ErrorMessage from "../CommonUiComponents/Error";
import ProjectSliderWraper from "./ui/ProjectSliderWraper"
import {ButtonWrapper, StyledButton } from "./ui/ButtonWrapper";
import {SlideContainer} from "../SecondPage/ui/SlideContainer";
import {Dot, DotContainer} from "../CommonUiComponents/CustomDots";
import { SlideImage } from "../SecondPage/ui/SlideContainer";


export default function Slider() {
  const [slideImages, setSlideImages] = useState(frontendCourses); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentSlide, setCurrentSlide] = useState(0); 
  const slideRef = useRef(); 
  const [activeCategory, setActiveCategory] = useState('frontend');

  useEffect(() => {
    setLoading(true);
    setError(null); 
    const loadImages = () => {
      const promises = slideImages.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = () => reject(new Error(`Failed to load image ${src}`));
        });
      });

      Promise.all(promises)
        .then(() => setLoading(false))
        .catch((err) => {
          console.error(err);
          setError('Failed to load images');
          setLoading(false);
        });
    };

    loadImages();
  }, [slideImages]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
  };

  const handleCategoryChange = (category) => {
    setCurrentSlide(0);
    setActiveCategory(category); 
    if (category === "frontend") {
      setSlideImages(frontendCourses);
    } else if (category === "backend") {
      setSlideImages(backendCourses);
    } else if (category === "fullstack") {
      setSlideImages(fullstackCourses);
    } else {
      setSlideImages(generalCourses);
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index); 
    slideRef.current.goTo(index); 
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <ProjectSliderWraper>
      <ButtonWrapper>
        <StyledButton
          onClick={() => handleCategoryChange('frontend')}
          $active={activeCategory === 'frontend'} 
        >
          Frontend
        </StyledButton>
        <StyledButton
          onClick={() => handleCategoryChange('backend')}
          $active={activeCategory === 'backend'} 
        >
          Backend
        </StyledButton>
        <StyledButton
          onClick={() => handleCategoryChange('fullstack')}
          $active={activeCategory === 'fullstack'} 
        >
          Fullstack
        </StyledButton>
        <StyledButton
          onClick={() => handleCategoryChange('general')}
          $active={activeCategory === 'general'} 
        >
          General
        </StyledButton>
      </ButtonWrapper>

      <>
        <Slide
          easing="ease"
          duration={slideImages.length > 1 ? 3000 : 0} 
          autoplay={slideImages.length > 1}           
          prevArrow={
            <CustomPrevArrow onClick={handlePrevSlide}>
              <button>&lt;</button>
            </CustomPrevArrow>
          }
          nextArrow={
            <CustomNextArrow onClick={handleNextSlide}>
              <button>&gt;</button>
            </CustomNextArrow>
          }
          ref={slideRef} 
          onChange={(oldIndex, newIndex) => setCurrentSlide(newIndex)} 
        >
          {slideImages.map((slide, index) => (
            <SlideContainer key={index}>
              <SlideImage style={{ backgroundImage: `url(${slide})` }} />
            </SlideContainer>
          ))}
        </Slide>

        <DotContainer>
          {slideImages.map((_, index) => (
            <Dot
              key={index}
              $active={index === currentSlide}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </DotContainer>
      </>
    </ProjectSliderWraper>
  );
}