---
title: Humanoid Robotics Basics
description: Understanding humanoid robot design, actuators, and control
---

# Module 2: Basics of Humanoid Robotics

## Module Overview

This module covers the mechanical and electrical foundations of humanoid robots, including design principles, actuation systems, and basic control concepts.

### Learning Objectives
- Understand humanoid robot anatomy
- Learn actuator types and selection
- Master sensor integration
- Grasp basic control principles

---

## Section 1: Robot Anatomy

### Skeletal Structure

A humanoid robot mimics human skeletal proportions:

- **Head**: Sensors, computing, camera systems
- **Torso**: Main body, computing core, battery
- **Arms**: Dual actuated limbs with hand mechanisms
- **Legs**: Bipedal or quadrupedal locomotion system
- **Hands**: Multi-fingered or gripper-based manipulation

### Degrees of Freedom (DOF)

```
Total DOF = 25-30 typical

Head:    3 DOF (pitch, roll, yaw)
Arms:   12 DOF (6 per arm: shoulder, elbow, wrist)
Torso:   3 DOF (pitch, roll, yaw)
Legs:    6 DOF (3 per leg: hip, knee, ankle)
Hands:   2 DOF (open/close per hand, or 5 per finger)

Total: ~30 DOF
```

### Forward Kinematics

Given joint angles, compute end-effector position:

$$\vec{p} = f(\theta_1, \theta_2, ..., \theta_n)$$

```python
import numpy as np
from scipy.spatial.transform import Rotation as R

class RobotKinematics:
    def __init__(self, link_lengths):
        self.L1, self.L2, self.L3 = link_lengths
    
    def forward_kinematics(self, theta1, theta2, theta3):
        # 3-link arm
        x = (self.L1 * np.cos(theta1) + 
             self.L2 * np.cos(theta1 + theta2) + 
             self.L3 * np.cos(theta1 + theta2 + theta3))
        y = (self.L1 * np.sin(theta1) + 
             self.L2 * np.sin(theta1 + theta2) + 
             self.L3 * np.sin(theta1 + theta2 + theta3))
        return np.array([x, y])
```

---

## Section 2: Actuators & Motors

### Types of Actuators

#### 1. Electric Motors
**Pros**: Precise control, efficient, quiet  
**Cons**: Require gearbox for torque

- **Stepper Motors**: Discrete steps, position known
- **Brushless DC (BLDC)**: Efficient, smooth control
- **Servo Motors**: Built-in feedback control

#### 2. Hydraulic Actuators
**Pros**: High force, high power density  
**Cons**: Complex, leakage risk, heat

#### 3. Pneumatic Actuators
**Pros**: Simple, safe, low cost  
**Cons**: Compressor required, less precise

### Motor Selection for Humanoid Robots

For a humanoid robot:
- **Shoulder**: High torque, moderate speed → Geared BLDC
- **Elbow**: Medium torque, medium speed → Servo motor
- **Wrist**: Low torque, high speed → Direct-drive motor
- **Hip/Knee**: Very high torque, slow → Heavy geared motor

### Example: Torque Calculation

For a humanoid arm lifting a 2 kg object:

$$\tau = m \cdot g \cdot L = 2 \text{ kg} \cdot 10 \text{ m/s}^2 \cdot 0.3 \text{ m} = 6 \text{ N⋅m}$$

```python
# Motor torque sizing
mass_object = 2.0  # kg
gravity = 9.81     # m/s^2
distance = 0.3     # m (distance from joint)

required_torque = mass_object * gravity * distance
print(f"Required torque: {required_torque:.2f} N⋅m")

# Add 50% safety margin
motor_torque = required_torque * 1.5
print(f"Motor selection: {motor_torque:.2f} N⋅m minimum")
```

---

## Section 3: Sensor Integration

### Feedback Control Loop

```
Desired → [Controller] → Motor Command → [Robot] → Sensors ↓
          ↑                                          │
          └──────────── Feedback ──────────────────┘
```

### Implementing PID Control

```python
class PIDController:
    def __init__(self, Kp, Ki, Kd):
        self.Kp = Kp  # Proportional gain
        self.Ki = Ki  # Integral gain
        self.Kd = Kd  # Derivative gain
        self.integral = 0
        self.last_error = 0
    
    def update(self, setpoint, measured_value, dt):
        error = setpoint - measured_value
        self.integral += error * dt
        derivative = (error - self.last_error) / dt
        
        output = (self.Kp * error + 
                 self.Ki * self.integral + 
                 self.Kd * derivative)
        
        self.last_error = error
        return output

# Example: Joint angle control
controller = PIDController(Kp=10, Ki=1, Kd=5)
setpoint = 90  # degrees

while True:
    current_angle = read_joint_angle()
    motor_command = controller.update(setpoint, current_angle, dt=0.01)
    send_to_motor(motor_command)
```

---

## Section 4: Control Principles

### Balance & Stability

For bipedal robots, maintaining balance requires:

1. **Center of Mass (CoM) Control**: Keep CoM within support polygon
2. **Zero Moment Point (ZMP)**: Ensure stability margin

$$\text{Stability Margin} = \text{Distance(ZMP, Support Boundary)}$$

```python
def is_stable(com_x, com_y, support_polygon):
    """Check if robot is stable"""
    from shapely.geometry import Point, Polygon
    
    point = Point(com_x, com_y)
    polygon = Polygon(support_polygon)
    
    if polygon.contains(point):
        return True  # Stable
    else:
        return False  # Will tip over
```

### Motion Planning

Generating feasible joint trajectories:

```python
import numpy as np
from scipy.interpolate import interp1d

def trajectory_planning(start, goal, duration, num_points=100):
    """Quintic trajectory planning"""
    t = np.linspace(0, duration, num_points)
    
    # Quintic polynomial
    a0 = start
    a1, a2, a3 = 0, 0, 0
    a4 = 10 * (goal - start) / (duration ** 4)
    a5 = 15 * (goal - start) / (duration ** 5)
    
    trajectory = (a0 + a1*t + a2*t**2 + 
                 a3*t**3 + a4*t**4 + a5*t**5)
    
    return t, trajectory

# Generate smooth trajectory from 0 to 90 degrees over 2 seconds
time, angles = trajectory_planning(start=0, goal=90, duration=2.0)
```

### Inverse Kinematics (IK)

Computing joint angles from desired end-effector position:

$$\theta = f^{-1}(\vec{p})$$

For a simple 2-link arm:

```python
def inverse_kinematics_2link(x, y, L1, L2):
    """Analytical IK for 2-link planar arm"""
    # Distance to target
    d = np.sqrt(x**2 + y**2)
    
    # Law of cosines
    cos_theta2 = (d**2 - L1**2 - L2**2) / (2 * L1 * L2)
    theta2 = np.arccos(np.clip(cos_theta2, -1, 1))
    
    # Using atan2 for angle
    alpha = np.arctan2(y, x)
    beta = np.arctan2(L2 * np.sin(theta2), L1 + L2 * np.cos(theta2))
    theta1 = alpha - beta
    
    return theta1, theta2
```

---

## Integration Example: Walking Controller

```python
class WalkingController:
    def __init__(self, robot):
        self.robot = robot
        self.gait_phase = 0
        self.step_length = 0.1  # meters
        self.step_height = 0.05  # meters
    
    def compute_gait_trajectory(self, time):
        """Generate walking pattern"""
        phase = (time * 2) % 1.0  # Frequency = 2 Hz
        
        if phase < 0.5:
            # Swing phase
            foot_height = self.step_height * np.sin(phase * np.pi)
            foot_position = self.step_length * phase
        else:
            # Stance phase
            foot_height = 0
            foot_position = self.step_length * (1 - (phase - 0.5))
        
        return foot_position, foot_height
```

---

## Key Takeaways

✅ Humanoid robots have 25-30 degrees of freedom  
✅ Motor selection depends on torque and speed requirements  
✅ Feedback control ensures accurate motion execution  
✅ Balance and stability are critical for bipedal locomotion  

---

## Next Steps

[Previous: Introduction to Physical AI ←](/docs/01-foundations)
