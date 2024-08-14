// Example 1
const receivedMsg = {
  activationId: null,
  submitter: ['SVC-VSON1', 'SVC-VSON3', 'SVC-VSON2', 'SVC-VSON3'],
  activationDataId: [350050247],
  nodeId: [107015],
  scheduled_type: 'SCHEDULE_MAINT',
}

let submitterId = receivedMsg.submitter

console.log(submitterId, 'submitterId')

// Count occurrences and find the most frequent submitter
let counts = {}
let maxSubmitter = submitterId[0]

for (let submitter of submitterId) {
  counts[submitter] = (counts[submitter] || 0) + 1
  if (counts[submitter] > counts[maxSubmitter]) {
    maxSubmitter = submitter
  }
}

console.log(maxSubmitter, 'is the selected submitter')