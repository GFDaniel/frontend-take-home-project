import React from 'react';
import Canvas from '../../src/components/Canvas';
import { mount } from '@cypress/react';

describe('Canvas Component', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
      });

    // test to verify that the canvas matches the snapshot
    it('should match the canvas snapshot', () => {
        cy.get('canvas').should('be.visible');
        cy.get('canvas').toMatchImageSnapshot({
          failureThreshold: 0.01,
          failureThresholdType: 'percent',
        });
    });

    // test to verify pencil tool functionality and drawing programmatically
    it('should select pencil tool and draw on the canvas programmatically', () => {
        cy.get('[data-testid="pencil"]').click();
        cy.get('[data-testid="canvas"]').then($canvas => {
            const context = $canvas[0].getContext('2d');
            const canvasWidth = $canvas[0].width;
            const canvasHeight = $canvas[0].height;

            // clear the canvas and draw a line programmatically
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.strokeStyle = 'black';
            context.lineWidth = 5;
            context.beginPath();
            context.moveTo(50, 50);
            context.lineTo(150, 150);
            context.stroke();
    
            cy.wait(1000);
            // check if the drawing pattern exists on the canvas
            cy.get('[data-testid="canvas"]').then($canvas => {
                const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    
                function containsDrawingPattern(imageData) {
                    const { width, height, data } = imageData;
                    const pixelThreshold = 50;
                    const drawingPixels = [];
                    const radius = 10;
    
                    for (let offsetY = -radius; offsetY <= radius; offsetY++) {
                        for (let offsetX = -radius; offsetX <= radius; offsetX++) {
                            const xCoord = 50 + offsetX;
                            const yCoord = 50 + offsetY;
                            if (xCoord >= 0 && xCoord < width && yCoord >= 0 && yCoord < height) {
                                const index = (yCoord * width + xCoord) * 4;
                                const r = data[index];
                                const g = data[index + 1];
                                const b = data[index + 2];
                                const a = data[index + 3];
                                if (r < 50 && g < 50 && b < 50 && a > 100) {
                                    drawingPixels.push({ x: xCoord, y: yCoord });
                                }
                            }
                        }
                    }
                    return drawingPixels.length > pixelThreshold;
                }

                const hasDrawing = containsDrawingPattern(imageData);
                expect(hasDrawing).to.be.true;
            });
        });
    });

    // test to verify eraser tool functionality and erasing programmatically
    it('should select eraser tool and erase from the canvas programmatically', () => {
        cy.get('[data-testid="eraser"]').click();
        cy.get('[data-testid="canvas"]').then($canvas => {
            const context = $canvas[0].getContext('2d');
            const canvasWidth = $canvas[0].width;
            const canvasHeight = $canvas[0].height;
    
            // draw a line on the canvas
            context.strokeStyle = 'black';
            context.lineWidth = 5;
            context.beginPath();
            context.moveTo(50, 50);
            context.lineTo(150, 150);
            context.stroke();
        });

        cy.wait(1000);
        // use eraser tool to erase part of the drawing
        cy.get('[data-testid="canvas"]').then($canvas => {
            const context = $canvas[0].getContext('2d');
            const canvasWidth = $canvas[0].width;
            const canvasHeight = $canvas[0].height;
    
            context.strokeStyle = 'white';
            context.lineWidth = 20;
            context.clearRect(100 - 10, 100 - 10, 50, 50);
    
            cy.wait(1000);
            // check if the eraser successfully erased the drawing
            cy.get('[data-testid="canvas"]').then($canvas => {
                const context = $canvas[0].getContext('2d');
                const canvasWidth = $canvas[0].width;
                const canvasHeight = $canvas[0].height;
                const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    
                function containsDrawingPattern(imageData) {
                    const { width, height, data } = imageData;
                    const pixelThreshold = 50;
                    const drawingPixels = [];
                    const radius = 10;
    
                    for (let offsetY = -radius; offsetY <= radius; offsetY++) {
                        for (let offsetX = -radius; offsetX <= radius; offsetX++) {
                            const xCoord = 100 + offsetX;
                            const yCoord = 100 + offsetY;
                            if (xCoord >= 0 && xCoord < width && yCoord >= 0 && yCoord < height) {
                                const index = (yCoord * width + xCoord) * 4;
                                const r = data[index];
                                const g = data[index + 1];
                                const b = data[index + 2];
                                const a = data[index + 3];
                                if (r < 50 && g < 50 && b < 50 && a > 100) {
                                    drawingPixels.push({ x: xCoord, y: yCoord });
                                }
                            }
                        }
                    }
                    return drawingPixels.length > pixelThreshold;
                }
    
                const hasDrawing = containsDrawingPattern(imageData);
                expect(hasDrawing).to.be.false;
            });
        });
    });

    // test to verify color change functionality and drawing programmatically
    it('should change color of drawing tool and draw on the canvas programmatically', () => {
        cy.get('[data-testid="pencil"]').click();  
        cy.get('[data-testid="select-color"]').select('red');
        cy.get('[data-testid="canvas"]').then($canvas => {
            const context = $canvas[0].getContext('2d');
            const canvasWidth = $canvas[0].width;
            const canvasHeight = $canvas[0].height;
    
            // clear the canvas and draw a line with the selected color
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.strokeStyle = 'red';  
            context.lineWidth = 5;
            context.beginPath();
            context.moveTo(100, 100);
            context.lineTo(200, 200);
            context.stroke();
            
            cy.wait(1000);
            // check if the drawing with the new color exists on the canvas
            cy.get('[data-testid="canvas"]').then($canvas => {
                const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    
                function containsDrawingPattern(imageData) {
                    const { width, height, data } = imageData;
                    const pixelThreshold = 50;
                    const drawingPixels = [];
                    const radius = 10;
    
                    for (let offsetY = -radius; offsetY <= radius; offsetY++) {
                        for (let offsetX = -radius; offsetX <= radius; offsetX++) {
                            const xCoord = 100 + offsetX;
                            const yCoord = 100 + offsetY;
                            if (xCoord >= 0 && xCoord < width && yCoord >= 0 && yCoord < height) {
                                const index = (yCoord * width + xCoord) * 4;
                                const r = data[index];
                                const g = data[index + 1];
                                const b = data[index + 2];
                                const a = data[index + 3];
                                if (r > 200 && g < 50 && b < 50 && a > 100) {
                                    drawingPixels.push({ x: xCoord, y: yCoord });
                                }
                            }
                        }
                    }
                    return drawingPixels.length > pixelThreshold;
                }

                const hasDrawing = containsDrawingPattern(imageData);
                expect(hasDrawing).to.be.true;
            });
        });
    });    
});
  