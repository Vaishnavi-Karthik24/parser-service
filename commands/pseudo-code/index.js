// Example 1
const receivedMsg = {
  activationId: null,
  submitter: ['test1', 'test3', 'test2', 'test3'],
  DataId: [350050247],
  Id: [107015],
  scheduled_type: 'SCHEDULE_MAINT',
}

let submitterId = receivedMsg.submitter

console.log(submitterId, 'submitterId')

// Count occurrences and find the most frequent submitter
let counts = {}
let maxSubmitter = submitterId[0]
let remainingSubmitters = ''

if (submitterId.length > 1) {
  for (let submitter of submitterId) {
    counts[submitter] = (counts[submitter] || 0) + 1
    if (counts[submitter] > counts[maxSubmitter]) {
      maxSubmitter = submitter
    }
  }
  // Filter out the maxSubmitter and create a comma-separated string
  remainingSubmitters += submitterId
    .filter((submitter) => submitter !== maxSubmitter)
    .join(',')
  console.log(
    `Submitters received :: ${submitterId.length} and maximum submitter is :: ${maxSubmitter} and remaining submitters will be :: ${remainingSubmitters}`
  )
} else {
  console.log(
    `Submitters received :: ${submitterId.length} and maximum submitter will be :: ${maxSubmitter}`
  )
}
