module.exports = {
  tutorialSidebar: [
    'intro', // Welcome page
    {
      type: 'category',
      label: 'Textbook Chapters',
      items: [
        'foundations', // NOT '01-foundations'
        'robotics',    // NOT '02-robotics'
        'gazebo',
        'ros2',
        'vision',
        'capstone',
      ],
    },
  ],
};