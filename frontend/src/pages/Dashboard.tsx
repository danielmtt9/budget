import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Dashboard</h2>
        <Link to="/settings">
           <Button variant="outline-primary" size="sm">Connect Bank</Button>
        </Link>
      </div>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Balance</Card.Title>
              <Card.Text className="display-6">$0.00</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Income</Card.Title>
              <Card.Text className="text-success">$0.00</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Expenses</Card.Title>
              <Card.Text className="text-danger">$0.00</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
