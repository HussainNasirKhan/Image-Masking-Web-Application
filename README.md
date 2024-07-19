# Image Masking Web Application

This Flask-based web application allows users to upload an image, draw shapes and strokes (rectangles, brush strokes, and erase strokes) on it, and generate a mask. The mask can then be downloaded directly from the application.

## Features

- **Image Upload:** Allows users to upload an image that will be displayed on a canvas.
- **Drawing Tools:** 
  - **Rectangle:** Draw rectangles on the image.
  - **Brush:** Apply brush strokes with adjustable size.
  - **Erase:** Remove parts of the image with adjustable erase size.
- **Mask Generation:** Processes the image and user drawings to generate a mask.
- **Download Mask:** Provides an option to download the generated mask image.

## Technology Stack

- **Backend:** Flask (Python)
- **Frontend:** HTML, CSS, JavaScript
- **Image Processing:** OpenCV (Python)
- **Canvas Drawing:** HTML5 Canvas API

## Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/HussainNasirKhan/Image-Masking-Web-Application.git

2. **Navigate to the Project Directory:**
   ```bash
   cd Image-Masking-Web-Application

3. **Install Dependencies:**
   Ensure you have Python and pip installed. Install Flask and OpenCV with:
   ```bash
   pip install flask opencv-python

4. **Run the Application:**
   ```bash
   python app.py
Visit http://127.0.0.1:5000 in your browser to use the application.

## Usage

1. **Upload an Image:**
   - Use the file upload form on the homepage to upload an image. The image will be displayed on the canvas.

2. **Draw on the Image:**
   - **Select Mode:** Choose the drawing mode from the dropdown menu (Rectangle, Brush, Erase).
   - **Rectangle Mode:** Click and drag on the canvas to draw rectangles.
   - **Brush Mode:** Click and drag on the canvas to apply brush strokes. Adjust the brush size using the input field.
   - **Erase Mode:** Click and drag on the canvas to erase parts of the image. Adjust the erase size using the input field.

3. **Generate Mask:**
   - Click the "Generate Mask" button to process the image and user drawings. The mask will be created based on the shapes and strokes applied.

4. **Download Mask:**
   - After the mask is generated, the mask image will be displayed below the canvas. Click the "Download Mask" button to download the mask image.
