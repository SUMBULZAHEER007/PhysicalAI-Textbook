---
title: Digital Twin - Gazebo Simulation
description: Building and simulating robots in Gazebo
---

# Module 3: Digital Twin - Gazebo Simulation

## Overview

Gazebo is the industry-standard open-source robotics simulator. It provides realistic physics simulation, sensor simulation, and visualization for testing robot algorithms before deployment to hardware.

### Why Simulation?

- **Safety**: Test dangerous behaviors safely
- **Speed**: Iterate faster than real hardware
- **Cost**: No risk of breaking expensive robots
- **Scalability**: Simulate multiple robots easily

---

## Section 1: Gazebo Basics

### Installation

```bash
# Ubuntu/Debian
sudo apt-get install gazebo-latest ros-humble-gazebo-* 

# macOS with Homebrew
brew install gazebo
```

### URDF (Unified Robot Description Format)

URDF is XML-based format for specifying robot structure:

```xml
<?xml version="1.0" ?>
<robot name="humanoid_bot">
  
  <link name="base_link">
    <inertial>
      <mass value="50"/>
      <inertia ixx="1" ixy="0" ixz="0" iyy="1" iyz="0" izz="1"/>
    </inertial>
    <visual>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <box size="0.3 0.2 0.5"/>
      </geometry>
    </collision>
  </link>
  
  <joint name="shoulder_pitch" type="revolute">
    <parent link="base_link"/>
    <child link="upper_arm"/>
    <axis xyz="0 1 0"/>
    <limit lower="0" upper="3.14" effort="10" velocity="1"/>
  </joint>
  
</robot>
```

---

## Section 2: Physics Simulation

### ODE Physics Engine

Gazebo uses Open Dynamics Engine (ODE) for physics:

```python
# Configure physics in launch file
import xml.etree.ElementTree as ET

physics_params = {
    'update_rate': 1000,      # Hz
    'max_step_size': 0.001,   # seconds
    'gravity': [0, 0, -9.81]  # m/s^2
}
```

### Contact Simulation

```python
# Contact handling
class ContactSimulator:
    def __init__(self):
        self.friction_coefficient = 0.5
        self.restitution = 0.1  # Bounciness
    
    def compute_contact_force(self, normal_force):
        friction = normal_force * self.friction_coefficient
        return friction
```

---

## Section 3: Sensor Simulation

### Camera Simulation

```xml
<sensor name="camera" type="camera">
  <always_on>true</always_on>
  <update_rate>30</update_rate>
  <camera>
    <horizontal_fov>1.57</horizontal_fov>
    <image>
      <width>640</width>
      <height>480</height>
    </image>
  </camera>
</sensor>
```

### Lidar Simulation

```python
# Simulate Lidar in ROS
import rospy
from sensor_msgs.msg import LaserScan

def simulate_lidar(gazebo_model):
    """Simulate 2D Lidar scan"""
    laser_pub = rospy.Publisher('/scan', LaserScan, queue_size=10)
    
    scan = LaserScan()
    scan.header.frame_id = 'lidar_link'
    scan.angle_min = -3.14  # -180°
    scan.angle_max = 3.14   # 180°
    scan.angle_increment = 0.01
    scan.range_min = 0.1
    scan.range_max = 30.0
    
    laser_pub.publish(scan)
```

---

## Key Takeaways

✅ Gazebo enables safe robot testing  
✅ URDF describes robot structure  
✅ Physics engine simulates real-world forces  
✅ Sensors can be simulated for algorithm testing  

---

[Previous: Humanoid Robotics Basics ←](/docs/02-robotics)
