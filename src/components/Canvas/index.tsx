"use client";

import React, { useRef, useState, useEffect } from 'react';
import styles from './index.module.css';
import { FaPencilAlt, FaEraser, FaFont, FaPalette, FaDownload, FaUpload } from 'react-icons/fa';
import Modal from '../Modal';
import axios from 'axios';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'textbox' | 'icon' | 'image'>('pencil');
  const [color, setColor] = useState<string>('black');
  const [modalOpen, setModalOpen] = useState(false);
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryOptions, setCountryOptions] = useState<{ country:any, label: string; value: string, flag: string }[]>([]);
  const [flagUrl, setFlagUrl] = useState<string>('');


  // useEffect to fetch and set country data from the REST countries API
  // the country options state with data including the country, label, value and flag
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data.map((country: any) => ({
          country: country,
          label: country.name.common,
          value: country.cca2,
          flag: country.flags.png
        }));
        setCountryOptions(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // useEffect to initialize and configure the canvas element when the component mounts
  // this effect sets the canvas dimensions based on its client size, initializes the 2D context,
  // and sets default drawing properties such as line width, line cap style, and stroke color
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        setContext(ctx);
      }
    }
  }, []);

  // useEffect to update the stroke color and redraw the flag when color or flagUrl changes
  // this effect ensures that the canvas context's stroke color is updated and the flag is redrawn
  // whenever the color or the url of the flag changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      drawFlag();
    }
  }, [color, context, flagUrl]);

  // useEffect to update the canvas context based on the selected tool
  // this effect adjusts the context's global composite operation and line width depending on whether
  // the tool is 'eraser' or another drawing tool
  useEffect(() => {
    if (context) {
      if (tool === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = 20;
      } else {
        context.globalCompositeOperation = 'source-over';
        context.lineWidth = 5;
        context.strokeStyle = color;
      }
    }
  }, [tool, context]);

  // function to draw the selected country flag on the canvas. sets the tool to 'pencil', creates an image
  // element with the flag url and draws the flag onto the canvas when the image has loaded
  const drawFlag = () => {
    setTool("pencil");
    if (!context || !flagUrl) return;

    const img = new Image();
    img.src = flagUrl;
    img.onload = () => {
      context.drawImage(img, 10, 10, 75, 50);
    };
  };

  // function to start drawing on the canvas when the mouse is pressed down
  const startDrawing = (e: React.MouseEvent) => {
    if (!context) return;
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // function to draw on the canvas as the mouse moves. draws a line based on the current 
  // tool (pencil or eraser) and updates the canvas context
  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !context) return;
    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = 20;
    } else {
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 5;
      context.strokeStyle = color;
    }
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  // function to stop drawing on the canvas when the mouse is released or leaves the canvas
  const stopDrawing = () => {
    if (context) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  // function to open the text input modal when the 'textbox' tool is selected and sets the position 
  // for the text based on the mouse event and opens the modal for text input
  const openTextModal = (e: React.MouseEvent) => {
    if (tool === 'textbox') {
      setTextPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      setModalOpen(true);
    }
  };

  // function to add text to the canvas at the specified position and draws a text box and the
  // text itself on the canvas using the current color and position
  const addText = (text: string) => {
    if (!context || !textPosition) return;
    context.globalCompositeOperation = 'source-over';
    const { x, y } = textPosition;
    context.font = '20px Arial';
    const textWidth = context.measureText(text).width;
    const textHeight = 20;
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.strokeRect(x - 2, y - textHeight, textWidth + 4, textHeight + 4);
    context.fillStyle = color;
    context.fillText(text, x, y);
  };  

  // function to handle image file upload and draw the uploaded image on the canvas. reads the uploaded
  // image file and draws it onto the canvas when the image loads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && context) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        context.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      };
    }
  };

  // function to trigger the file input click event, opens the file input dialog to select and 
  // upload an image
  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // function to download the canvas content as a PNG image
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'canvas-drawing.png';
      link.click();
    }
  };

  // function to handle the change in selected country from the dropdown. updates the selected 
  // country state and sets the URL for the country flag image
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    console.log("country: ", country)
    setSelectedCountry(country);
    setFlagUrl(countryOptions.find(option => option.value === country)?.country.flags.png);
  };

  return (
    <div className={styles.canvasContainer}>
      <div className={styles.controls}>
        <button data-testid="pencil" className={tool === "pencil" ? styles.toolButtonActive : styles.toolButton} onClick={() => setTool('pencil')}><FaPencilAlt /></button>
        <button data-testid="eraser" className={tool === "eraser" ? styles.toolButtonActive : styles.toolButton} onClick={() => setTool('eraser')}><FaEraser /></button>
        <button data-testid="textbox" className={tool === "textbox" ? styles.toolButtonActive : styles.toolButton} onClick={() => setTool('textbox')}><FaFont /></button>
        <FaPalette color={color}/> 
        <select data-testid="select-color" className={styles.colorSelector} onChange={(e) => setColor(e.target.value)} value={color}>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
        </select>
        <button aria-label="Image" className={styles.upDownloadButton} onClick={handleImageButtonClick}><FaUpload /> Upload</button>
        <button data-testid="download" className={styles.upDownloadButton} onClick={downloadCanvas}><FaDownload /> Download</button>
        <select data-testid="select-flag" className={styles.colorSelector} onChange={handleCountryChange} value={selectedCountry}>
          <option value="">Select Your Country Flag</option>
          {countryOptions.map((country) => (
            <option key={country.value} value={country.value}>{country.label}</option>
          ))}
        </select>
      </div>
      <canvas
        data-testid="canvas"
        ref={canvasRef}
        onMouseDown={tool === 'textbox' ? openTextModal : startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '1px solid #000', cursor: 'crosshair', width: '100%', height: '100%' }}
      />
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addText}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Canvas;
