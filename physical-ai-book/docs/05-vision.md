---
title: Robot Vision & Perception
description: Computer vision for robotics
---

# Module 5: Robot Vision & Perception

## Overview

Vision is one of the most important sensors for humanoid robots. This module covers camera systems, object detection, and semantic understanding.

---

## Section 1: Camera Systems

### RGB Cameras

```python
import cv2

def capture_frame():
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    return frame

# Frame dimensions
frame = capture_frame()
height, width, channels = frame.shape
print(f"Resolution: {width}x{height}, Channels: {channels}")
```

### Depth Cameras (RGB-D)

```python
import pyrealsense2 as rs

# Intel RealSense D435
pipeline = rs.pipeline()
config = rs.config()
config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)
config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)

pipeline.start(config)
frames = pipeline.wait_for_frames()
depth_frame = frames.get_depth_frame()
color_frame = frames.get_color_frame()
```

---

## Section 2: Object Detection

### Using YOLO

```python
import cv2
from ultralytics import YOLO

model = YOLO('yolov8n.pt')  # Nano model

def detect_objects(frame):
    results = model(frame)
    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    return frame
```

---

## Section 3: Semantic Segmentation

```python
# Semantic segmentation with DeepLabV3
from torchvision.models.segmentation import deeplabv3_resnet50
import torch

model = deeplabv3_resnet50(pretrained=True)
model.eval()

# Process image
input_tensor = preprocess(frame)
with torch.no_grad():
    output = model(input_tensor)
    segmentation_map = output['out'].argmax(1)
```

---

## Key Takeaways

✅ Multiple camera types for different tasks  
✅ Deep learning enables robust detection  
✅ Semantic segmentation for scene understanding  

---

[Previous: ROS 2 ←](/docs/04-ros2)
