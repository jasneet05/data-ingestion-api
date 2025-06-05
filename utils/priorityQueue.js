const priorityMap = { HIGH: 1, MEDIUM: 2, LOW: 3 };
let queue = [];

function enqueue(job) {
  queue.push(job);
  queue.sort((a, b) => {
    const pA = priorityMap[a.priority];
    const pB = priorityMap[b.priority];
    return pA - pB || new Date(a.timestamp) - new Date(b.timestamp);
  });
}

function dequeue() {
  return queue.shift();
}

function isEmpty() {
  return queue.length === 0;
}

module.exports = { enqueue, dequeue, isEmpty };
