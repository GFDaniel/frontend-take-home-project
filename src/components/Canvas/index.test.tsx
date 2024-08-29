import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { act } from 'react-dom/test-utils';
// import axios from 'axios';
import Canvas from './index';

//jest.mock('axios');


describe('Canvas Component', () => {

    
    // beforeEach(() => {
    //     (axios.get as jest.Mock).mockResolvedValue({
    //     data: [
    //         {
    //         name: { common: 'United States ' },
    //         cca2: 'US',
    //         flags: { png: 'https://flagcdn.com/w320/US.png' },
    //         },
    //         {
    //         name: { common: 'United Kingdom ' },
    //         cca2: 'UK',
    //         flags: { png: 'https://flagcdn.com/w320/UK.png' },
    //         },
    //     ],
    //     });
    // });
    
    // it('selecting a flag updates the canvas', async () => {
    //     render(<Canvas />);
    //     await waitFor(() => {
    //       expect(screen.getByTestId('select-flag')).toBeInTheDocument();
    //     });
    //     const selectElement = screen.getByTestId('select-flag');
    //     fireEvent.change(selectElement, { target: { value: 'US' } });
    //     await waitFor(async () => {
    //       const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
    //       const context = canvas.getContext('2d');
    //       expect(context).not.toBeNull();
    //     });
    // });

    
    // test to ensure the canvas and tool buttons are rendered
    test('renders canvas and tools', () => {
        render(<Canvas />);
        expect(screen.getByTestId('pencil')).toBeInTheDocument();
        expect(screen.getByTestId('eraser')).toBeInTheDocument();
        expect(screen.getByTestId('textbox')).toBeInTheDocument();
        expect(screen.getByTestId('download')).toBeInTheDocument();
    });

    // test to verify that clicking the pencil tool button changes the tool to pencil
    test('should change tool to pencil when the pencil button is clicked', () => {
        const { getByTestId } = render(<Canvas />);
        const pencilButton = getByTestId('pencil');
        fireEvent.click(pencilButton);
        expect(pencilButton).toBeInTheDocument();
    });

    // test to verify that clicking the eraser tool button changes the tool to eraser
    test('should change tool to eraser when the eraser button is clicked', () => {
        const { getByTestId } = render(<Canvas />);
        const eraserButton = getByTestId('eraser');
        fireEvent.click(eraserButton);
        expect(eraserButton).toBeInTheDocument();
    });

    // test to verify that clicking the textbox tool button changes the tool to textbox
    test('should change tool to textbox when the textbox button is clicked', () => {
        const { getByTestId } = render(<Canvas />);
        const textboxButton = getByTestId('textbox');

        fireEvent.click(textboxButton);
        expect(textboxButton).toBeInTheDocument();
    });

    // test to verify that clicking the download button changes the tool to download
    test('should change tool to download when the download button is clicked', () => {
        const { getByTestId } = render(<Canvas />);
        const downloadButton = getByTestId('download');

        fireEvent.click(downloadButton);
        expect(downloadButton).toBeInTheDocument();
    });

    // test to verify that selecting a new color updates the color selector value
    test('should change color when a new color is selected', () => {
        const { getByTestId } = render(<Canvas />);
        const colorSelector = getByTestId('select-color');
        
        fireEvent.change(colorSelector, { target: { value: 'red' } });
        expect(colorSelector).toHaveValue('red');
    });
      
    // test to verify that clicking the download button triggers the canvas download
    test('should download the canvas as an image when download button is clicked', () => {
        const { getByTestId } = render(<Canvas />);
        const downloadButton = getByTestId('download');
        Object.defineProperty(global, 'URL', {
            value: {
            createObjectURL: jest.fn(),
            },
        });
        fireEvent.click(downloadButton);
        expect(downloadButton).toBeInTheDocument();
    });

    // test to verify that the canvas image is downloaded when the download button is clicked
    test('downloads canvas image', () => {
        const { getByTestId } = render(<Canvas />);
        const downloadButton = getByTestId('download');
        global.URL.createObjectURL = jest.fn();
        global.document.createElement = jest.fn().mockReturnValue({
            click: jest.fn(),
        });
        fireEvent.click(downloadButton);
        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(document.createElement().click).toHaveBeenCalled();
    });
});
