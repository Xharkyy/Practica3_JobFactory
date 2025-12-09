// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.30;

import "./FreelanceEscrow.sol";

/**
 * @title JobFactory
 * @notice Factory pattern para crear jobs con escrow independientes.
 *         Utiliza EIP-1167 (clones) para optimizar gas en la creación de escrows.
 */
contract JobFactory {
    // --- Tipos ---
    enum JobStatus { Created, Accepted, InProgress, Delivered, Completed, Cancelled }

    struct Job {
        address escrow;
        address client;
        address freelancer;
        JobStatus status;
        string title;
        string description;
        string jobSpecIpfsHash; // CID del JSON con detalles del job en IPFS
        uint256 createdAt;
        uint256 amount;
    }

    // Parámetros numéricos para reducir pila
    struct JobParams {
        uint256 amount;
        uint256 deadline;
        uint256 challengePeriod;
    }

    // --- Estado ---
    address public immutable escrowImplementation;
    Job[] public jobs;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public freelancerJobs;

    // --- Eventos ---
    event JobCreated(
        uint256 indexed jobId,
        address indexed client,
        string title,
        string jobSpecIpfsHash,
        uint256 amount
    );

    event JobAccepted(
        uint256 indexed jobId,
        address indexed freelancer,
        address indexed escrow
    );

    event JobCancelled(
        uint256 indexed jobId
    );

    // --- Errores ---
    error OnlyClient();
    error OnlyFreelancer();
    error InvalidJob();
    error JobAlreadyAccepted();
    error InvalidStatus();

    // --- Constructor ---
    /**
     * @notice Despliega la implementación base del escrow para clones.
     */
    constructor() {
        escrowImplementation = address(new FreelanceEscrow());
    }

    // --- Funciones principales ---

    /**
     * @notice Cliente publica un nuevo job sin freelancer específico.
     *         El job se mantiene en estado "Created" hasta que se acepte.
     */
    function postJob(
        JobParams calldata p,
        string calldata _title,
        string calldata _description,
        string calldata _jobSpecIpfsHash
    ) external returns (uint256) {
        require(p.amount > 0, "Amount must be > 0");
        require(bytes(_title).length > 0, "Title required");

        jobs.push(
            Job({
                escrow: address(0),
                client: msg.sender,
                freelancer: address(0),
                status: JobStatus.Created,
                title: _title,
                description: _description,
                jobSpecIpfsHash: _jobSpecIpfsHash,
                createdAt: block.timestamp,
                amount: p.amount
            })
        );

        uint256 jobId = jobs.length - 1;
        clientJobs[msg.sender].push(jobId);

        emit JobCreated(jobId, msg.sender, _title, _jobSpecIpfsHash, p.amount);

        return jobId;
    }

    

    /**
     * @notice Freelancer acepta un job publicado.
     *         Se despliega automáticamente el contrato escrow mediante clone.
     */
    function acceptJob(
        uint256 jobId,
        address _arbiter,
        uint256 _deadline,
        uint256 _challengePeriod
    ) external returns (address) {
        require(jobId < jobs.length, "Invalid jobId");
        Job storage job = jobs[jobId];

        if (job.status != JobStatus.Created) revert JobAlreadyAccepted();
        require(msg.sender != job.client, "Client cannot accept own job");

        // Desplegar escrow mediante clone
        address escrowAddr = _deployEscrowClone(
            job.client,
            msg.sender,
            _arbiter,
            job.amount,
            _deadline,
            _challengePeriod
        );

        job.freelancer = msg.sender;
        job.escrow = escrowAddr;
        job.status = JobStatus.Accepted;

        freelancerJobs[msg.sender].push(jobId);

        emit JobAccepted(jobId, msg.sender, escrowAddr);

        return escrowAddr;
    }

    /**
     * @notice Cliente cancela un job que aún no ha sido aceptado.
     */
    function cancelJob(uint256 jobId) external {
        require(jobId < jobs.length, "Invalid jobId");
        Job storage job = jobs[jobId];

        if (msg.sender != job.client) revert OnlyClient();
        if (job.status != JobStatus.Created) revert InvalidStatus();

        job.status = JobStatus.Cancelled;
        emit JobCancelled(jobId);
    }

    // --- Funciones internas ---

    /**
     * @notice Despliega un clone del escrow y lo inicializa.
     */
    function _deployEscrowClone(
        address _client,
        address _freelancer,
        address _arbiter,
        uint256 _amount,
        uint256 _deadline,
        uint256 _challengePeriod
    ) internal returns (address) {
        // Clonamos la implementación base
        address clone = _cloneEscrow(escrowImplementation);

        // Inicializamos el clone
        FreelanceEscrow(payable(clone)).initialize(
            _client,
            _freelancer,
            _arbiter,
            _amount,
            _deadline,
            _challengePeriod
        );

        return clone;
    }

    /**
     * @notice Implementación del clonado EIP-1167 (Minimal Proxy).
     *         Reduce significativamente el gas en comparación con `new`.
     *         Basado en estándar EIP-1167.
     */
    function _cloneEscrow(address implementation) internal returns (address instance) {
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr, 0x14), shl(96, implementation))
            mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf300000000000000000000000000000000)
            instance := create(0, ptr, 0x37)
        }
        require(instance != address(0), "Clone failed");
    }

    // --- Funciones de vista ---

    function getJobsCount() external view returns (uint256) {
        return jobs.length;
    }

    function getJob(uint256 jobId) external view returns (Job memory) {
        require(jobId < jobs.length, "Invalid jobId");
        return jobs[jobId];
    }

    function getClientJobs(address _client) external view returns (uint256[] memory) {
        return clientJobs[_client];
    }

    function getFreelancerJobs(address _freelancer) external view returns (uint256[] memory) {
        return freelancerJobs[_freelancer];
    }
}
