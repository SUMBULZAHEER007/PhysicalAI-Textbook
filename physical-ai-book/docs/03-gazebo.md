---
title: Robot Simulation with Gazebo
description: Building and simulating robots in Gazebo
keywords: [gazebo, simulation, urdf]
---

# Robot Simulation with Gazebo

Gazebo is the industry-standard open-source robotics simulator providing realistic physics simulation, sensor simulation, and visualization.

## Why Simulation?

- Safety: Test dangerous behaviors safely
- Speed: Iterate faster than real hardware
- Cost: No risk of breaking expensive robots
- Scalability: Simulate multiple robots easily
- Reproducibility: Exact same conditions every time

## URDF Format

URDF (Unified Robot Description Format) is an XML-based format for specifying robot structure:
- Links: Rigid bodies with mass and inertia
- Joints: Connections between links (revolute, prismatic, fixed)
- Visual geometry: 3D meshes for display
- Collision geometry: Simplified shapes for physics
- Sensors: Cameras, lidar, force-torque sensors

A URDF robot consists of:
- Base link (starting point)
- Connected child links via joints
- Inertia properties for physics
- Visual and collision models

## Physics Simulation

Gazebo uses Open Dynamics Engine (ODE) for physics:
- Simulates forces and torques
- Handles collisions between objects
- Computes joint constraints
- Update rate: 1000 Hz typical
- Gravity: -9.81 m/s²

## Sensor Simulation

### Camera Simulation

Cameras in simulation:
- Horizontal FOV: 1.57 radians (90 degrees)
- Resolution: 640x480 or higher
- Output: RGB images like real cameras
- Update Rate: 30 Hz typical

### Lidar Simulation

Lidar sensors in simulation:
- Range: 0.1 to 30 meters
- Angular Resolution: 0.01 radians typical
- Output: Point cloud data
- Update Rate: 10 Hz typical

### Contact Simulation

Contact simulation between objects:
- Friction coefficient determines sliding behavior
- Restitution controls bounciness
- Normal impulses prevent penetration

## Simulation Advantages

1. Algorithm Testing: Validate control algorithms before hardware
2. Learning: Safe environment for machine learning
3. Parameter Tuning: Adjust parameters without breaking hardware
4. Scenario Testing: Replay failures and edge cases
5. Scaling: Test with many robots simultaneously

## Workflow: Simulation to Hardware

1. Develop in Gazebo simulation
2. Test with realistic sensor noise
3. Validate on real hardware with careful progression
4. Tune parameters based on real-world results
5. Deploy final algorithm

## Limitations of Simulation

- Physics approximations differ from reality
- Sensor noise may not match real sensors
- Material properties hard to model perfectly
- Lighting simulation complex
- Ground truth always available (cheating)

## Best Practices

1. Use realistic sensor models with noise
2. Test with multiple random seeds
3. Validate key assumptions on hardware early
4. Don't over-rely on perfect simulation data
5. Keep model parameters up-to-date

---

**Next:** Learn about ROS 2 middleware for robot applications.
