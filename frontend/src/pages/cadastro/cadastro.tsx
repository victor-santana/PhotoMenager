import { useState } from 'react';
import { Container, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

const Cadastro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validarFormulario = () => {
    const novosErros: any = {};

    if (!formData.nome.trim()) {
      novosErros.nome = "O nome é obrigatório.";
    }

    if (!formData.email.includes('@')) {
      novosErros.email = "Insira um e-mail válido.";
    }

    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;

    if (!regexSenha.test(formData.senha)) {
      novosErros.senha = "A senha deve ter no mínimo 6 caracteres, incluindo letras maiúsculas, minúsculas, números e um caractere especial (!@#$%^&*).";
    }

    if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validarFormulario()) {
      setLoading(true);
      try {
        await userService.cadastrar(formData);

        navigate('/');
      } catch (error: any) {
        const mensagemErro = error.response?.data?.error || "Erro ao conectar com o servidor";
        alert("Erro no cadastro: " + mensagemErro);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Col xs={12} sm={8} md={6} lg={4}>
        <Card className="shadow-sm border-0 p-4" style={{ backgroundColor: "#ffffff", borderRadius: "15px" }}>
          <Card.Body>
            <h2 className="text-center mb-4 fw-bold">Meus álbuns de fotos</h2>
            <p className="text-center text-muted">Faça seu cadastro:</p>

            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Nome</Form.Label>
                <Form.Control
                  name="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  isInvalid={!!errors.nome}
                />
                <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">E-mail</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Senha</Form.Label>
                <Form.Control
                  name="senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.senha}
                  onChange={handleChange}
                  isInvalid={!!errors.senha}
                />
                <Form.Control.Feedback type="invalid">{errors.senha}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Confirmar Senha</Form.Label>
                <Form.Control
                  name="confirmarSenha"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmarSenha}
                />
                <Form.Control.Feedback type="invalid">{errors.confirmarSenha}</Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <Link to="/" className="text-decoration-none text-danger fw-bold">Cancelar</Link>
                <Button
                  variant="primary"
                  type="submit"
                  className="px-5 py-2"
                  style={{ backgroundColor: "#1a4a83", border: "none" }}
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Concluir'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default Cadastro;