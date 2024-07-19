import os
import cv2
import numpy as np
from flask import Flask, request, render_template, send_from_directory, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['image']
    if file:
        file_path = os.path.join('static', 'uploads', file.filename)
        file.save(file_path)
        return jsonify({'image_path': file_path})
    return jsonify({'error': 'No file uploaded'}), 400

@app.route('/process', methods=['POST'])
def process():
    data = request.json
    rectangles = data.get('rectangles', [])
    brush_strokes = data.get('brush_strokes', [])
    erase_strokes = data.get('erase_strokes', [])
    
    img_path = data.get('image_path')
    if not img_path:
        return jsonify({'error': 'No image path provided'}), 400
    
    image = cv2.imread(img_path)
    mask = np.zeros(image.shape[:2], dtype=np.uint8)
    
    # Draw rectangles on the mask
    for rect in rectangles:
        cv2.rectangle(mask, (rect[0], rect[1]), (rect[2], rect[3]), 255, -1)
    
    # Draw brush strokes on the mask
    for stroke in brush_strokes:
        for (x, y) in stroke['points']:
            cv2.circle(mask, (x, y), stroke['size'], 255, -1)
    
    # Draw erase strokes on the mask
    for stroke in erase_strokes:
        for (x, y) in stroke['points']:
            cv2.circle(mask, (x, y), stroke['size'], 0, -1)
    
    mask_path = os.path.join('static', 'mask.png')
    cv2.imwrite(mask_path, mask)
    
    return jsonify({'mask_path': mask_path})

@app.route('/static/<path:path>')
def send_file(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    if not os.path.exists('static/uploads'):
        os.makedirs('static/uploads')
    app.run(debug=True)
