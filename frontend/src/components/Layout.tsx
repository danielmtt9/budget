import { Navbar, Container, Nav } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">Budget App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <SideNavLink to="/transactions" icon="receipt_long" label="Transactions" />
                <SideNavLink to="/settings" icon="settings" label="Settings" />
                <SideNavLink to="/profile" icon="person" label="Profile" />
            </div>
            
            <div className="flex flex-col gap-1">
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
