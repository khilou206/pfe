import React from 'react';
import '../styles/About.css';
import ProjectOwner from '../Components/biograph';
import ServicesGallery from '../Components/Services';
import WorkProcess from '../Components/WorkProcess';
import AboutPremium from '../Components/WorkProcess';


const About = () => {
  return <>
  <ProjectOwner />
  <ServicesGallery />
  <AboutPremium />

  </>
}

export default About;