// src/contracts/abis/JobFactory.json
const JobFactoryABI = [
  {
    "inputs": [],
    "name": "OnlyClient",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlyFreelancer",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidJob",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "JobAlreadyAccepted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidStatus",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "jobId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "client",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "jobSpecIpfsHash",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "JobCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "jobId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "freelancer",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "escrow",
        "type": "address"
      }
    ],
    "name": "JobAccepted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "jobId",
        "type": "uint256"
      }
    ],
    "name": "JobCancelled",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "constructor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "name": "amount",
            "type": "uint256"
          },
          {
            "name": "deadline",
            "type": "uint256"
          },
          {
            "name": "challengePeriod",
            "type": "uint256"
          }
        ],
        "name": "p",
        "type": "tuple"
      },
      {
        "name": "_title",
        "type": "string"
      },
      {
        "name": "_description",
        "type": "string"
      },
      {
        "name": "_jobSpecIpfsHash",
        "type": "string"
      }
    ],
    "name": "postJob",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "jobId",
        "type": "uint256"
      },
      {
        "name": "_arbiter",
        "type": "address"
      },
      {
        "name": "_deadline",
        "type": "uint256"
      },
      {
        "name": "_challengePeriod",
        "type": "uint256"
      }
    ],
    "name": "acceptJob",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "jobId",
        "type": "uint256"
      }
    ],
    "name": "cancelJob",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "escrowImplementation",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getJobsCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "jobId",
        "type": "uint256"
      }
    ],
    "name": "getJob",
    "outputs": [
      {
        "components": [
          {
            "name": "escrow",
            "type": "address"
          },
          {
            "name": "client",
            "type": "address"
          },
          {
            "name": "freelancer",
            "type": "address"
          },
          {
            "name": "status",
            "type": "uint8"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "jobSpecIpfsHash",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_client",
        "type": "address"
      }
    ],
    "name": "getClientJobs",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_freelancer",
        "type": "address"
      }
    ],
    "name": "getFreelancerJobs",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

module.exports = JobFactoryABI;
