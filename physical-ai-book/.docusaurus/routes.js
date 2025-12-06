import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/PhysicalAI-Textbook/markdown-page',
    component: ComponentCreator('/PhysicalAI-Textbook/markdown-page', '187'),
    exact: true
  },
  {
    path: '/PhysicalAI-Textbook/docs',
    component: ComponentCreator('/PhysicalAI-Textbook/docs', '76a'),
    routes: [
      {
        path: '/PhysicalAI-Textbook/docs',
        component: ComponentCreator('/PhysicalAI-Textbook/docs', 'ea6'),
        routes: [
          {
            path: '/PhysicalAI-Textbook/docs',
            component: ComponentCreator('/PhysicalAI-Textbook/docs', 'cde'),
            routes: [
              {
                path: '/PhysicalAI-Textbook/docs/',
                component: ComponentCreator('/PhysicalAI-Textbook/docs/', '17e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/PhysicalAI-Textbook/docs/capstone',
                component: ComponentCreator('/PhysicalAI-Textbook/docs/capstone', '2f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/PhysicalAI-Textbook/docs/foundations',
                component: ComponentCreator('/PhysicalAI-Textbook/docs/foundations', 'e2e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/PhysicalAI-Textbook/docs/gazebo',
                component: ComponentCreator('/PhysicalAI-Textbook/docs/gazebo', '0b9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/PhysicalAI-Textbook/docs/robotics',
                component: ComponentCreator('/PhysicalAI-Textbook/docs/robotics', '37f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/PhysicalAI-Textbook/docs/ros2',
                component: ComponentCreator('/PhysicalAI-Textbook/docs/ros2', '470'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/PhysicalAI-Textbook/docs/vision',
                component: ComponentCreator('/PhysicalAI-Textbook/docs/vision', '123'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/PhysicalAI-Textbook/',
    component: ComponentCreator('/PhysicalAI-Textbook/', '456'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
