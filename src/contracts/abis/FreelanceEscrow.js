// src/contracts/abis/FreelanceEscrow.js
const FreelanceEscrowABI = [
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
    "name": "OnlyArbiter",
    "type": "error"
  },
  {
    "inputs": [
      {
        "name": "expected",
        "type": "uint8"
      },
      {
        "name": "got",
        "type": "uint8"
      }
    ],
    "name": "InvalidState",
    "type": "error"
  },
  {
    "inputs": [
      {
        "name": "expected",
        "type": "uint256"
      },
      {
        "name": "got",
        "type": "uint256"
      }
    ],
    "name": "WrongValue",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DeadlineNotReached",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ChallengeNotOver",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ChallengeWindowOver",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoArbiter",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyDisputed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyInitialized",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "client",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "freelancer",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "arbiter",
        "type": "address"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "client",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Funded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "freelancer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "when",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "Delivered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "by",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "when",
        "type": "uint256"
      }
    ],
    "name": "Disputed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Refunded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Released",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "arbiter",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "toFreelancer",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "toClient",
        "type": "uint256"
      }
    ],
    "name": "Resolved",
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
        "name": "_client",
        "type": "address"
      },
      {
        "name": "_freelancer",
        "type": "address"
      },
      {
        "name": "_arbiter",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
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
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fund",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "markDelivered",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "approveRelease",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "releaseAfterChallenge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "raiseDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "payToFreelancer",
        "type": "uint256"
      }
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "refundIfDeadlinePassed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "client",
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
    "name": "freelancer",
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
    "name": "arbiter",
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
    "name": "amount",
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
    "inputs": [],
    "name": "deadline",
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
    "inputs": [],
    "name": "challengePeriod",
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
    "inputs": [],
    "name": "state",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deliveredAt",
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
    "inputs": [],
    "name": "disputed",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deliveredHash",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialized",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "timeLeftToDeadline",
    "outputs": [
      {
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "timeLeftToAutoRelease",
    "outputs": [
      {
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

module.exports = FreelanceEscrowABI;
