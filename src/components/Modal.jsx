import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModeloModal = ({
  show = false,
  title = 'Modal',
  onClose = null,
  onSave = null,
  onCancel = null,
  children = null,
  size = 'lg',
  centered = true,
  saveText = 'Guardar',
  cancelText = 'Cancelar',
  loading = false,
  saveVariant = 'primary'
}) => {
  return (
    <Modal show={show} onHide={onClose} size={size} centered={centered}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onCancel || onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        {onSave && (
          <Button
            variant={saveVariant}
            onClick={onSave}
            disabled={loading}
          >
            {loading ? '⏳ Guardando...' : saveText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModeloModal;
