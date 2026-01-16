import { useState } from 'react';
import { Container, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userService.logar({ email, password });

      localStorage.setItem('userId', response.data._id);
      localStorage.setItem('userName', response.data.name);

      navigate('/albumList');
    } catch (error: any) {
      const msg = error.response?.data?.error || "Falha na conexão com o servidor";
      alert("Erro ao entrar: " + msg);
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Col xs={12} sm={8} md={6} lg={4}>
        <Card className="shadow-sm border-0 p-4" style={{ backgroundColor: "#ffffff", borderRadius: "15px" }}>
          <Card.Body>
            <h2 className="text-center mb-4 fw-bold">Meus álbuns de fotos</h2>
            <p className="text-center text-muted">Autentique-se</p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="nome@exemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite sua senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <Link to="/cadastro" className="text-decoration-none fw-bold" style={{ color: "#1a4a83" }}>
                  Cadastre-se
                </Link>
                <Button
                  variant="primary"
                  type="submit"
                  className="px-5 py-2"
                  style={{ backgroundColor: "#1a4a83", border: "none" }}
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default Login;