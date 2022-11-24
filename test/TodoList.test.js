const { assert } = require("chai");

const TodoList = artifacts.require("TodoList.sol");

contract("TodoList", (accounts) => {
   before(async() => {
      this.todoList = await TodoList.deployed();
   })

   it("Deploys successfully", async() => {
      const address = await this.todoList.address;
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
   });

   it("Lists tasks", async() => {
      const taskCount = await this.todoList.taskCount();
      const task = await this.todoList.tasks(taskCount);
      assert.equal(task.ID.toNumber(), taskCount.toNumber())
      assert.equal(task.content, "Hello!! I am Vatsal")
      assert.equal(task.completed, false);
      assert.equal(task.ID.toNumber(), 1);
   })

   it("Creates tasks", async() => {
      const result = await this.todoList.createTask("Software Development");
      const taskCount = await this.todoList.taskCount();
      assert.equal(taskCount.toNumber(), 2)
      const event = result.logs[0].args;
      assert.equal(event.ID.toNumber(), 2)
      assert.equal(event.content, "Software Development")
      assert.equal(event.completed, false)
   })
})
