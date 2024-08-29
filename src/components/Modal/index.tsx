import React, { useState } from 'react';
import styles from './index.module.css';

// define the interface for the props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [inputText, setInputText] = useState('');

  // if the modal is not open, return null to render nothing
  if (!isOpen) return null;

  // function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputText);
    setInputText('');
    onClose();
  };

  return (
    <div data-testid="modal" className={styles.modalOverlay}>
        <div className={styles.modalContent}>
            <h1 className={styles.modalTitle}>Enter Text</h1>
            <form onSubmit={handleSubmit}>
                <input
                    data-testid="modal-input"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text"
                    className={styles.inputField}
                />
                <div className={styles.buttonContainer}>
                    <button data-testid="modal-button-submit" type="submit" className={styles.submitButton}>Add</button>
                    <button data-testid="modal-button-close" type="button" className={styles.closeButton} onClick={onClose}>Close</button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Modal;
