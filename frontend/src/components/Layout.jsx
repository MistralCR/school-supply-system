import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="min-vh-100">
      <Header />
      <Container fluid className="px-0">
        <Row className="g-0">
          <Sidebar />
          <Col md={9} lg={10} className="p-4">
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Layout;
