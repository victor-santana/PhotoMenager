import { useState } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { photoService, type IPhotoData } from '../../services/photoService';

interface AddFotoProps {
  show: boolean;
  onHide: () => void;
  onSave: (novaFoto: any) => void;
  albumId: string;
}

const AddFoto = ({ show, onHide, onSave, albumId }: AddFotoProps) => {
  const env = import.meta.env;
  const [loading, setLoading] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataAquisicao, setDataAquisicao] = useState('');
  const [cor, setCor] = useState('#000000');
  const [imageUrl, setImageUrl] = useState('');
  const [tamanho, setTamanho] = useState<number>(0);

  const handleUpload = () => {
    // @ts-ignore
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        styles: {
          palette: { window: "#FFFFFF", sourceBg: "#F4F4F5", windowBorder: "#90A0B3", tabIcon: "#0078FF" }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Upload concluído: ", result.info);
          setImageUrl(result.info.secure_url);
          setTamanho(result.info.bytes);
        }
      }
    );
    myWidget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) return alert("Por favor, faça o upload de uma imagem primeiro!");

    setLoading(true);

    try {
      const payload: IPhotoData = {
        title: titulo,
        description: descricao,
        acquisitionDate: new Date(dataAquisicao).toISOString(),
        size: tamanho,
        predominantColor: cor,
        imageUrl: imageUrl,
        albumId: albumId,
      };

      const response = await photoService.criar(payload);
      onSave(response.data);
      limparCampos();
      onHide();
    } catch (error: any) {
      alert("Erro ao salvar: " + (error.response?.data?.error || "Erro interno"));
    } finally {
      setLoading(false);
    }
  };

  const limparCampos = () => {
    setTitulo('');
    setDescricao('');
    setDataAquisicao('');
    setCor('#000000');
    setImageUrl('');
    setTamanho(0);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Nova Foto (Cloudinary)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          <div className="mb-4 text-center">
            {imageUrl ? (
              <div className="position-relative d-inline-block">
                <Image src={imageUrl} thumbnail style={{ maxHeight: '200px' }} />
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 rounded-circle"
                  onClick={() => setImageUrl('')}
                >
                  X
                </Button>
              </div>
            ) : (
              <Button
                variant="outline-primary"
                onClick={handleUpload}
                className="w-100 py-3 d-flex flex-column align-items-center gap-2"
                style={{ borderStyle: 'dashed', borderWidth: '2px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>add_a_photo</span>
                Selecionar ou Tirar Foto
              </Button>
            )}
            {tamanho > 0 && <div className="small text-muted mt-2">Tamanho: {(tamanho / 1024).toFixed(2)} KB</div>}
          </div>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Título da Foto"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted">Data de aquisição</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={dataAquisicao}
                  onChange={(e) => setDataAquisicao(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-muted">Cor Predom.</Form.Label>
                <Form.Control
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-grid mt-2">
            <Button
              type="submit"
              disabled={loading || !imageUrl}
              style={{ backgroundColor: "#1a4a83", border: "none" }}
              className="py-2 fw-bold"
            >
              {loading ? "Processando..." : "Salvar no Álbum"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddFoto;