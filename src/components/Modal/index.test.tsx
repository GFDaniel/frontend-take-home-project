import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './index';

describe('Modal Component', () => {
  // mock functions for onClose and onSubmit props
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  // clear mock function calls after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test to ensure the modal is not rendered when isOpen is false
  test('should not render when isOpen is false', () => {
    const { queryByTestId } = render(<Modal isOpen={false} onClose={onClose} onSubmit={onSubmit} />);
    expect(queryByTestId('modal')).toBeNull();
  });

  // test to ensure the modal is rendered when isOpen is true
  test('should render when isOpen is true', () => {
    const { getByTestId } = render(<Modal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    expect(getByTestId('modal')).toBeInTheDocument();
  });

  // test to check if onClose is called when the close button is clicked
  test('should call onClose when close button is clicked', () => {
    const { getByTestId } = render(<Modal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    fireEvent.click(getByTestId('modal-button-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // test to verify the input field value updates as the user types
  test('should update input value when typed into', () => {
    const { getByTestId } = render(<Modal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    const input = getByTestId('modal-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello World!' } });
    expect(input.value).toBe('Hello World!');
  });

  // test to ensure onSubmit is called with the input text and the input is reset when the form is submitted
  test('should call onSubmit with input text and reset input when form is submitted', () => {
    const { getByTestId } = render(<Modal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    const input = getByTestId('modal-input') as HTMLInputElement;
    const submitButton = getByTestId('modal-button-submit');
    fireEvent.change(input, { target: { value: 'Hello World!' } });
    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalledWith('Hello World!');
    expect(input.value).toBe('');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
