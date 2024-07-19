document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const modeSelect = document.getElementById('mode');
    const brushSizeInput = document.getElementById('brush-size');
    const eraseSizeInput = document.getElementById('erase-size');
    const applyButton = document.getElementById('apply-button');
    const downloadButton = document.getElementById('download-button');
    let startX, startY, endX, endY, drawing = false;
    let brushStrokes = [];
    let eraseStrokes = [];
    const rectangles = [];
    let imagePath = '';

    document.getElementById('upload-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', document.getElementById('image-upload').files[0]);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.image_path) {
                imagePath = data.image_path;
                img.src = data.image_path;
            }
        });
    });

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };

    canvas.addEventListener('mousedown', function(e) {
        if (modeSelect.value === 'rectangle') {
            startX = e.offsetX;
            startY = e.offsetY;
            drawing = true;
        } else if (modeSelect.value === 'brush') {
            drawing = true;
            brushStrokes.push({ points: [[e.offsetX, e.offsetY]], size: parseInt(brushSizeInput.value) });
        } else if (modeSelect.value === 'erase') {
            drawing = true;
            eraseStrokes.push({ points: [[e.offsetX, e.offsetY]], size: parseInt(eraseSizeInput.value) });
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        if (drawing) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            rectangles.forEach(rect => {
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
                ctx.strokeRect(rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]);
            });
            brushStrokes.forEach(stroke => {
                stroke.points.forEach(([x, y]) => {
                    ctx.fillStyle = 'green';
                    ctx.beginPath();
                    ctx.arc(x, y, stroke.size, 0, 2 * Math.PI);
                    ctx.fill();
                });
            });
            eraseStrokes.forEach(stroke => {
                stroke.points.forEach(([x, y]) => {
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.arc(x, y, stroke.size, 0, 2 * Math.PI);
                    ctx.fill();
                });
            });
            if (modeSelect.value === 'rectangle') {
                endX = e.offsetX;
                endY = e.offsetY;
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
                ctx.strokeRect(startX, startY, endX - startX, endY - startY);
            } else if (modeSelect.value === 'brush') {
                const currentStroke = brushStrokes[brushStrokes.length - 1];
                currentStroke.points.push([e.offsetX, e.offsetY]);
                currentStroke.points.forEach(([x, y]) => {
                    ctx.fillStyle = 'green';
                    ctx.beginPath();
                    ctx.arc(x, y, currentStroke.size, 0, 2 * Math.PI);
                    ctx.fill();
                });
            } else if (modeSelect.value === 'erase') {
                const currentStroke = eraseStrokes[eraseStrokes.length - 1];
                currentStroke.points.push([e.offsetX, e.offsetY]);
                currentStroke.points.forEach(([x, y]) => {
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.arc(x, y, currentStroke.size, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        drawing = false;
        if (modeSelect.value === 'rectangle') {
            endX = e.offsetX;
            endY = e.offsetY;
            rectangles.push([startX, startY, endX, endY]);
        }
    });

    applyButton.addEventListener('click', function() {
        const mode = modeSelect.value;
        fetch('/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                rectangles: rectangles, 
                brush_strokes: brushStrokes, 
                erase_strokes: eraseStrokes,
                brush_size: parseInt(brushSizeInput.value),
                erase_size: parseInt(eraseSizeInput.value),
                image_path: imagePath,
                mode: mode 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.mask_path) {
                const maskImage = document.getElementById('mask-image');
                maskImage.src = data.mask_path;
                maskImage.style.display = 'block';
                downloadButton.href = data.mask_path;
                downloadButton.style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
