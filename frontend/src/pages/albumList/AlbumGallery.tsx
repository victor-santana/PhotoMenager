import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Modal, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Album from '../../components/album/album';
import { userService } from '../../services/userService';
import { albumService } from '../../services/albumService';

const AlbumGallery = () => {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [loading, setLoading] = useState(true);
  const [albuns, setAlbuns] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAlbuns = useCallback(async (userId: string, page: number) => {
    setLoading(true);
    try {
      const response = await albumService.listarPorUsuario(userId, page);

      setAlbuns(response.data.albums);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Erro ao carregar álbuns:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      navigate('/');
      return;
    }

    const carregarDadosIniciais = async () => {
      try {
        const userRes = await userService.buscarPorId(userId);
        setNomeUsuario(userRes.data.name);

        await fetchAlbuns(userId, 1);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      }
    };

    carregarDadosIniciais();
  }, [navigate, fetchAlbuns]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const removerAlbumDaLista = (id: string) => {
    setAlbuns(prevAlbuns => prevAlbuns.filter(album => album._id !== id));
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const payload = {
        title: novoTitulo,
        description: novaDescricao,
        user: userId
      };

      await albumService.criar(payload);

      await fetchAlbuns(userId, 1);

      setShowCreateModal(false);
      setNovoTitulo('');
      setNovaDescricao('');
    } catch (error: any) {
      alert("Erro ao criar álbum: " + error.message);
    }
  };

  const mudarPagina = (novaPagina: number) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchAlbuns(userId, novaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Container fluid className="py-5" style={{ minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col xs={11} lg={10}>

          <div
            className="d-flex flex-column flex-md-row justify-content-md-between align-items-center mb-4 text-dark p-3 rounded-4 text-center text-md-start"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 className="fw-bold m-0 mb-3 mb-md-0">Meus álbuns de fotos</h2>

            <div className="d-flex align-items-center gap-2">
              <span>
                {loading && albuns.length === 0 ? 'Carregando...' : `Olá, ${nomeUsuario}`}
              </span>
              <Button
                variant="link"
                onClick={handleLogout}
                className="p-0 text-decoration-none fw-bold text-dark small d-flex align-items-center gap-2 mx-3"
              >
                Sair
                <span className="material-symbols-outlined">logout</span>
              </Button>
            </div>
          </div>

          <Card className="shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px', backgroundColor: '#ffffff' }}>
            <Row className="g-4">
              {albuns.length > 0 ? (
                albuns.map((item) => (
                  <Album
                    key={item._id}
                    id={item._id}
                    titulo={item.title}
                    descricao={item.description}
                    onDelete={removerAlbumDaLista}
                  />
                ))
              ) : (
                <Col className="text-center text-muted py-5">
                  {loading ? 'Buscando seus álbuns...' : 'Você ainda não possui álbuns criados.'}
                </Col>
              )}
            </Row>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
                <Button
                  variant="outline-primary"
                  disabled={currentPage === 1 || loading}
                  onClick={() => mudarPagina(currentPage - 1)}
                  className="rounded-pill px-4"
                >
                  Anterior
                </Button>

                <span className="fw-bold">
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  variant="outline-primary"
                  disabled={currentPage === totalPages || loading}
                  onClick={() => mudarPagina(currentPage + 1)}
                  className="rounded-pill px-4"
                >
                  Próxima
                </Button>
              </div>
            )}

            <div className="d-flex justify-content-end mt-5">
              <Button
                size="lg"
                onClick={() => setShowCreateModal(true)}
                style={{ backgroundColor: "#1a4a83", border: "none", padding: "12px 25px" }}
                className="d-flex align-items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Criar novo álbum
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Criar novo álbum</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form onSubmit={handleCreateAlbum}>
            <Form.Group className="mb-3">
              <Form.Control
                size="lg"
                type="text"
                placeholder="Título do Álbum"
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                size="lg"
                as="textarea"
                rows={3}
                placeholder="Descrição do Álbum"
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" size="lg" style={{ backgroundColor: "#1a4a83", border: "none" }} className="py-2 fw-bold">
                Concluir
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AlbumGallery;