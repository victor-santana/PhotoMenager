import { useState, useEffect, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { photoService } from '../../services/photoService';
import type { Foto } from '../album/album';

interface FotoTableRowProps {
    foto: Foto;
    onUpdate: (id: string, novoTitulo: string, novaDescricao: string) => void;
    onDeleteRequest: (id: string) => void;
}

const FotoTableRow = ({ foto, onUpdate, onDeleteRequest }: FotoTableRowProps) => {
    const [localTitulo, setLocalTitulo] = useState(foto.title);
    const [salvando, setSalvando] = useState(false);

    const salvarNoBanco = useCallback(async (novoT: string) => {
        setSalvando(true);
        try {
            await photoService.atualizar(foto._id, { title: novoT });
            onUpdate(foto._id, novoT, foto.description);
        } catch (error) {
            console.error("Erro ao atualizar título na tabela:", error);
        } finally {
            setSalvando(false);
        }
    }, [foto._id, foto.description, onUpdate]);

    useEffect(() => {
        if (localTitulo === foto.title) return;

        const timer = setTimeout(() => {
            salvarNoBanco(localTitulo);
        }, 1500);

        return () => clearTimeout(timer);
    }, [localTitulo, foto.title, salvarNoBanco]);

    return (
        <tr>
            <td>
                <div className="d-flex align-items-center gap-2">
                    <Form.Control
                        type="text"
                        value={localTitulo}
                        onChange={(e) => setLocalTitulo(e.target.value)}
                        className="bg-transparent border-0 p-0 shadow-none"
                        style={{ fontWeight: 'inherit' }}
                    />
                    {salvando && <small className="text-info" style={{ fontSize: '10px' }}>●</small>}
                </div>
            </td>
            <td>{foto.size}</td>
            <td>{new Date(foto.acquisitionDate).toLocaleDateString('pt-BR')}</td>
            <td>
                <div className="d-flex align-items-center gap-2">
                    <div style={{
                        width: '15px',
                        height: '15px',
                        backgroundColor: foto.predominantColor,
                        borderRadius: '3px',
                        border: '1px solid #dee2e6'
                    }}></div>

                    <span style={{
                        backgroundColor: '#212529',
                        color: foto.predominantColor,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        display: 'inline-block',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}>
                        {foto.predominantColor}
                    </span>
                </div>
            </td>
            <td>
                <Button variant="link" className="text-danger p-0" onClick={() => onDeleteRequest(foto._id)}>
                    <span className="material-symbols-outlined">delete</span>
                </Button>
            </td>
        </tr>
    );
};

export default FotoTableRow;