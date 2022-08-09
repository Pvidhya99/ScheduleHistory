import React from 'react';
import { Col, Row } from 'reactstrap';

const Footer = () => (
  <footer>
    <Row noGutters className="justify-content-between text-center fs--1 mt-4 mb-3">
      <Col sm="auto">
        <p className="mb-0 text-600">
          Powered by <span className="d-none d-sm-inline-block">| </span>
          <br className="d-sm-none" /> {new Date().getFullYear()} &copy; <a href="https://www.mealmanage.com/">MealManage LLC.</a>
        </p>
      </Col>
      <Col sm="auto">
        <p className="mb-0 text-600"><a href="/">Privacy Policy</a></p>
      </Col>
    </Row>
  </footer>
);

export default Footer;
