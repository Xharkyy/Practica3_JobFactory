// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.30;

import "./escrow.sol";

contract JobFactory {
    struct Job {
        address escrow;
        address client;
        address freelancer;
        string title;
        string description;
        string jobSpecIpfsHash; // CID del JSON con detalles del job en IPFS
    }

    // Agrupamos parámetros numéricos para reducir la pila
    struct JobParams {
        uint256 amount;
        uint256 deadline;
        uint256 challengePeriod;
    }

    Job[] public jobs;

    event JobCreated(
        uint256 indexed jobId,
        address indexed escrow,
        address indexed client,
        address freelancer,
        string title,
        string jobSpecIpfsHash
    );

    function createJob(
        address _freelancer,
        address _arbiter,
        JobParams calldata p,              // <-- struct en vez de 3 uints sueltos
        string calldata _title,
        string calldata _description,
        string calldata _jobSpecIpfsHash
    ) external {
        address escrowAddr = _deployEscrow(
            msg.sender,
            _freelancer,
            _arbiter,
            p
        );

        jobs.push(
            Job({
                escrow: escrowAddr,
                client: msg.sender,
                freelancer: _freelancer,
                title: _title,
                description: _description,
                jobSpecIpfsHash: _jobSpecIpfsHash
            })
        );

        uint256 jobId = jobs.length - 1;

        emit JobCreated(
            jobId,
            escrowAddr,
            msg.sender,
            _freelancer,
            _title,
            _jobSpecIpfsHash
        );
    }

    function _deployEscrow(
        address _client,
        address _freelancer,
        address _arbiter,
        JobParams calldata p
    ) internal returns (address) {
        FreelanceEscrow escrow = new FreelanceEscrow(
            _client,
            _freelancer,
            _arbiter,
            p.amount,
            p.deadline,
            p.challengePeriod
        );
        return address(escrow);
    }

    function getJobsCount() external view returns (uint256) {
        return jobs.length;
    }

    function getJob(uint256 jobId) external view returns (Job memory) {
        require(jobId < jobs.length, "Invalid jobId");
        return jobs[jobId];
    }
}
