// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
   uint public taskCount = 0;

   struct Task {
      uint ID;
      string content;
      bool completed;
   }

   mapping (uint => Task) public tasks;

   event TaskCreated(
      uint ID,
      string content,
      bool completed
   );

   event TaskCompleted(
      uint ID,
      bool completed
   );

   constructor() public {
      createTask("Hello!! I am Vatsal");
   }

   function createTask(string memory _content) public {
      taskCount++;
      tasks[taskCount] = Task(taskCount, _content, false);
      emit TaskCreated(taskCount, _content, false);
   }

   function toggleCompleted(uint _ID) public {
      Task memory _task = tasks[_ID];
      _task.completed = !(_task.completed);
      tasks[_ID] = _task;
      emit TaskCompleted(_ID, _task.completed);
   }
}
