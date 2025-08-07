import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function DownloadFileNameModal({ show, handleClose, handleDownload, fileType }) {
    const [fileName, setFileName] = useState('');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        // Reset fileName and error when modal opens or fileType changes
        if (show) {
            setFileName('');
            setLocalError('');
        }
    }, [show, fileType]);

    const handleConfirm = () => {
        if (!fileName.trim()) {
            setLocalError('Please enter a file name.');
            return;
        }
        setLocalError('');
        handleDownload(fileType, fileName.trim()); // Call the actual download function from parent
    };

    const modalTitle = fileType === 'excel' ? 'Download Excel File' : 'Download PPT File';
    const defaultFileName = fileType === 'excel' ? 'filtered_billboards' : 'filtered_billboards_presentation';
    const fileExtension = fileType === 'excel' ? '.xlsx' : '.pptx';

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {localError && <Alert variant="danger">{localError}</Alert>}
                <Form.Group controlId="formFileName">
                    <Form.Label>Enter file name (without extension):</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={defaultFileName}
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevent form submission
                                handleConfirm();
                            }
                        }}
                    />
                    <Form.Text className="text-muted">
                        The file will be saved as "{fileName || defaultFileName}{fileExtension}"
                    </Form.Text>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Download
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DownloadFileNameModal;