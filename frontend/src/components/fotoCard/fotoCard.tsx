import { useState, useEffect, useCallback } from 'react';
import { Card, Modal, Button, Form } from 'react-bootstrap';
import { photoService } from '../../services/photoService';

interface FotoProps {
  id: string;
  titulo: string;
  url: string;
  cor: string;
  descricao?: string;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, novoTitulo: string, novaDescricao: string) => void;
}

const FotoCard = ({ id, titulo, url, cor, descricao, onDelete, onUpdate }: FotoProps) => {
  const [showView, setShowView] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [localTitulo, setLocalTitulo] = useState(titulo);
  const [localDescricao, setLocalDescricao] = useState(descricao || "");
  const [salvando, setSalvando] = useState(false);

  const salvarAlteracoes = useCallback(async (novoT: string, novaD: string) => {
    setSalvando(true);
    try {
      await photoService.atualizar(id, {
        title: novoT,
        description: novaD
      });

      if (onUpdate) {
        onUpdate(id, novoT, novaD);
      }
    } catch (error) {
      console.error("Erro ao salvar automaticamente:", error);
    } finally {
      setSalvando(false);
    }
  }, [id, onUpdate]);

  useEffect(() => {
    if (localTitulo === titulo && localDescricao === (descricao || "")) return;

    const delayDebounceFn = setTimeout(() => {
      salvarAlteracoes(localTitulo, localDescricao);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [localTitulo, localDescricao, salvarAlteracoes, titulo, descricao]);

  const handleConfirmarExclusao = async () => {
    setLoading(true);
    try {
      await photoService.deletar(id);
      setShowConfirm(false);
      setShowView(false);
      if (onDelete) onDelete(id);
    } catch (error) {
      alert("Erro ao excluir foto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        className="h-100 border-0 shadow-sm"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowView(true)}
      >
        <Card.Img
          variant="top"
          src={url || "https://via.placeholder.com/150"}
          style={{ height: '150px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <Card.Body className="p-2 text-center">
          <Card.Title className="fw-bold mb-0 small text-truncate">{localTitulo}</Card.Title>
          <div style={{ height: '4px', backgroundColor: cor, width: '50%', margin: '5px auto 0', borderRadius: '2px' }} />
        </Card.Body>
      </Card>

      <Modal show={showView} onHide={() => setShowView(false)} size="xl" centered contentClassName="border-0 overflow-hidden">
        <Modal.Header closeButton className="bg-dark text-white border-0 px-4 py-3">
          <Modal.Title className="w-100">
            <Form.Control
              type="text"
              value={localTitulo}
              onChange={(e) => setLocalTitulo(e.target.value)}
              className="bg-transparent border-0 text-white fw-bold fs-4 p-0 shadow-none"
              style={{ caretColor: 'white' }}
              placeholder="Sem título"
            />
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0 bg-dark d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <img src={url} alt={localTitulo} className="img-fluid" style={{ maxHeight: '75vh', width: 'auto', objectFit: 'contain' }} />
        </Modal.Body>

        <Modal.Footer className="bg-dark text-white border-0 px-4 py-3 d-flex justify-content-between align-items-center">
          <div className="flex-grow-1 me-3">
            <Form.Control
              as="textarea"
              rows={2}
              value={localDescricao}
              onChange={(e) => setLocalDescricao(e.target.value)}
              className="bg-transparent border-0 text-light p-0 shadow-none mb-1"
              style={{ resize: 'none', caretColor: 'white' }}
              placeholder="Adicione uma descrição..."
            />
            <div className="d-flex align-items-center gap-3">
              <small style={{ color: cor }}>Cor predominante: {cor}</small>
              {salvando && <small className="text-info animate-pulse">● Salvando...</small>}
            </div>
          </div>
          <Button variant="outline-danger" className="d-flex align-items-center gap-2 border-0" onClick={() => setShowConfirm(true)}>
            <span className="material-symbols-outlined">delete</span>
            Excluir foto
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered size="sm">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold fs-5">Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-3">
          Tem certeza que deseja remover a foto <strong>{localTitulo}</strong>?
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-center gap-2 pb-4">
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmarExclusao} disabled={loading}>
            {loading ? "Removendo..." : "Sim, Remover"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FotoCard;