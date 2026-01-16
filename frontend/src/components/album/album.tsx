import { useState, useEffect, useCallback } from 'react';
import { Col, Card, Modal, Button, Table, Row, Form } from 'react-bootstrap';
import FotoCard from '../fotoCard/fotoCard';
import AddFotoModal from '../addFoto/addFoto';
import { albumService } from '../../services/albumService';
import { photoService } from '../../services/photoService';
import FotoTableRow from '../fotoTable/FotoTable';

export interface Foto {
  _id: string;
  title: string;
  description: string;
  size: number;
  acquisitionDate: string;
  predominantColor: string;
  imageUrl: string;
}

interface AlbumProps {
  id: string;
  titulo: string;
  descricao: string;
  onDelete: (id: string) => void;
}

const Album = ({ id, titulo, descricao, onDelete }: AlbumProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [showConfirmDeletePhoto, setShowConfirmDeletePhoto] = useState(false);
  const [showConfirmDeleteAlbum, setShowConfirmDeleteAlbum] = useState(false);

  const [viewMode, setViewMode] = useState<'tabela' | 'miniaturas'>('tabela');
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loadingFotos, setLoadingFotos] = useState(false);
  const [idParaRemover, setIdParaRemover] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [localTitulo, setLocalTitulo] = useState(titulo);
  const [localDescricao, setLocalDescricao] = useState(descricao);
  const [salvandoAlbum, setSalvandoAlbum] = useState(false);

  const fetchFotos = useCallback(async (page: number) => {
    setLoadingFotos(true);
    try {
      const response = await photoService.listarPorAlbum(id, page);
      setFotos(response.data.photos);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
    } finally {
      setLoadingFotos(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFotos(1);
  }, [fetchFotos]);

  const atualizarFotoNaLista = (fotoId: string, novoTitulo: string, novaDescricao: string) => {
    setFotos(prevFotos =>
      prevFotos.map(f =>
        f._id === fotoId
          ? { ...f, title: novoTitulo, description: novaDescricao }
          : f
      )
    );
  };

  const atualizarAlbumNoBanco = useCallback(async (novoT: string, novaD: string) => {
    setSalvandoAlbum(true);
    try {
      await albumService.atualizar(id, { title: novoT, description: novaD });
    } catch (error) {
      console.error("Erro ao atualizar álbum:", error);
    } finally {
      setSalvandoAlbum(false);
    }
  }, [id]);

  useEffect(() => {
    if (localTitulo === titulo && localDescricao === descricao) return;
    const timer = setTimeout(() => {
      atualizarAlbumNoBanco(localTitulo, localDescricao);
    }, 1500);
    return () => clearTimeout(timer);
  }, [localTitulo, localDescricao, atualizarAlbumNoBanco, titulo, descricao]);

  const confirmarRemocaoFoto = async () => {
    if (idParaRemover !== null) {
      try {
        await photoService.deletar(idParaRemover);
        fetchFotos(currentPage);
        setShowConfirmDeletePhoto(false);
        setIdParaRemover(null);
      } catch (error) {
        alert("Erro ao remover a foto.");
      }
    }
  };

  const confirmarExclusaoAlbum = async () => {
    try {
      await albumService.deletar(id);
      setShowConfirmDeleteAlbum(false);
      setShowDetails(false);
      onDelete(id);
    } catch (error: any) {
      alert("Falha ao excluir álbum: Verifique se ele está vazio.");
    }
  };

  return (
    <>
      <Col xs={12} sm={6} md={4} lg={3}>
        <Card className="h-100 border-0 shadow-sm" onClick={() => setShowDetails(true)} style={{ cursor: 'pointer' }}>
          <div style={{ height: '160px', backgroundColor: '#eeeeee' }} className="rounded-top d-flex align-items-center justify-content-center text-muted overflow-hidden">
            {fotos.length > 0 ? (
              <img src={fotos[0].imageUrl} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="Capa" />
            ) : ("Vazio")}
          </div>
          <Card.Body>
            <Card.Title className="fw-bold mb-1 text-truncate">{localTitulo}</Card.Title>
            <Card.Text className="text-muted small text-truncate">{localDescricao}</Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-muted small d-flex align-items-center gap-2">
            Meus álbuns de fotos
            {salvandoAlbum && <small className="text-info fw-normal" style={{ fontSize: '10px' }}>● Salvando...</small>}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            type="text"
            value={localTitulo}
            onChange={(e) => setLocalTitulo(e.target.value)}
            className="bg-transparent border-0 fw-bold fs-3 p-0 shadow-none mb-1"
            placeholder="Título do Álbum"
          />
          <Form.Control
            as="textarea"
            rows={2}
            value={localDescricao}
            onChange={(e) => setLocalDescricao(e.target.value)}
            className="bg-transparent border-0 text-muted p-0 shadow-none mb-4"
            style={{ resize: 'none' }}
            placeholder="Descrição do Álbum"
          />

          <div className="d-flex justify-content-end mb-3 small">
            <span>Visualizar como: </span>
            <span className={`ms-2 ${viewMode === 'tabela' ? 'fw-bold border-bottom border-dark' : 'text-primary'}`} onClick={() => setViewMode('tabela')} style={{ cursor: 'pointer' }}>Tabela</span>
            <span className="mx-1">/</span>
            <span className={`${viewMode === 'miniaturas' ? 'fw-bold border-bottom border-dark' : 'text-primary'}`} onClick={() => setViewMode('miniaturas')} style={{ cursor: 'pointer' }}>Miniaturas</span>
          </div>

          {loadingFotos ? (
            <p className="text-center py-5">Carregando fotos...</p>
          ) : (
            <>
              {viewMode === 'tabela' ? (
                <Table hover responsive className="border align-middle">
                  <thead style={{ backgroundColor: '#1a4a83', color: 'white' }}>
                    <tr>
                      <th>Título (clique para editar)</th>
                      <th>Tamanho</th>
                      <th>Data</th>
                      <th>Cor</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fotos.map(foto => (
                      <FotoTableRow
                        key={foto._id}
                        foto={foto}
                        onUpdate={atualizarFotoNaLista}
                        onDeleteRequest={(fotoId) => {
                          setIdParaRemover(fotoId);
                          setShowConfirmDeletePhoto(true);
                        }}
                      />
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Row className="g-3">
                  {fotos.map(foto => (
                    <Col key={foto._id} xs={6} sm={4} md={3}>
                      <FotoCard
                        id={foto._id}
                        titulo={foto.title}
                        url={foto.imageUrl}
                        cor={foto.predominantColor}
                        descricao={foto.description}
                        onDelete={() => fetchFotos(currentPage)}
                        onUpdate={atualizarFotoNaLista}
                      />
                    </Col>
                  ))}
                </Row>
              )}

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4 mb-2 gap-3">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === 1 || loadingFotos}
                    onClick={() => fetchFotos(currentPage - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="small fw-bold">Página {currentPage} de {totalPages}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === totalPages || loadingFotos}
                    onClick={() => fetchFotos(currentPage + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button variant="danger" className="d-flex align-items-center gap-2" disabled={fotos.length > 0} onClick={() => setShowConfirmDeleteAlbum(true)}>
              <span className="material-symbols-outlined">delete</span> Excluir álbum
            </Button>
            <Button style={{ backgroundColor: "#1a4a83", border: "none" }} onClick={() => setShowAddPhoto(true)} className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined">add_photo_alternate</span> Adicionar fotos
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmDeletePhoto} onHide={() => setShowConfirmDeletePhoto(false)} centered size="sm">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold fs-5">Remover foto?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">Deseja remover esta foto permanentemente?</Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-center gap-2 pb-4">
          <Button variant="secondary" onClick={() => setShowConfirmDeletePhoto(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarRemocaoFoto}>Sim, Remover</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmDeleteAlbum} onHide={() => setShowConfirmDeleteAlbum(false)} centered size="sm">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold fs-5 text-danger">Excluir álbum?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">Confirmar a exclusão do álbum <strong>{localTitulo}</strong>?</Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-center gap-2 pb-4">
          <Button variant="secondary" onClick={() => setShowConfirmDeleteAlbum(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarExclusaoAlbum}>Sim, Excluir</Button>
        </Modal.Footer>
      </Modal>

      <AddFotoModal
        show={showAddPhoto}
        onHide={() => setShowAddPhoto(false)}
        onSave={() => fetchFotos(1)}
        albumId={id}
      />
    </>
  );
};

export default Album;