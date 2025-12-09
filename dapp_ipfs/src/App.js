import React, { useState } from "react";
import "./App.css";
import { create } from "kubo-rpc-client";
import { Buffer } from "buffer";
import { addresses, abis } from "./contracts";
import { ethers } from "ethers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function formatTimestamp(ts) {
  try {
    if (!ts) return "-";
    const n = Number(ts) * 1000;
    if (isNaN(n)) return "-";
    return new Date(n).toLocaleString();
  } catch (e) {
    return "-";
  }
}

function App() {
  const [provider, setProvider] = useState(null);
  const [escrowContract, setEscrowContract] = useState(null);
  const [jobFactory, setJobFactory] = useState(null);
  const [signerAddress, setSignerAddress] = useState(null);
  // Estado on-chain del escrow “activo” (el fijo de addresses.escrow)
  const [clientAddr, setClientAddr] = useState(null);
  const [freelancerAddr, setFreelancerAddr] = useState(null);
  const [arbiterAddr, setArbiterAddr] = useState(null);
  const [amountWei, setAmountWei] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [challengePeriod, setChallengePeriod] = useState(null);
  const [state, setState] = useState(null);
  const [deliveredHash, setDeliveredHash] = useState("");
  const [deliveredAt, setDeliveredAt] = useState(null);
  const [disputed, setDisputed] = useState(false);

  // Encargos (jobs) del JobFactory
  const [jobs, setJobs] = useState([]);

  // UI / TX state
  const [txStatus, setTxStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // IPFS upload state (para markDelivered)
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Formulario crear encargo
  const [newFreelancer, setNewFreelancer] = useState("");
  const [newArbiter, setNewArbiter] = useState(ZERO_ADDRESS);
  const [newAmountEth, setNewAmountEth] = useState("0.0001");
  const [newDeadlineDays, setNewDeadlineDays] = useState("7");
  const [newChallengeSeconds, setNewChallengeSeconds] = useState("86400");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIpfsHash, setNewIpfsHash] = useState("");

  const escrowStateNames = ["Created","Funded","Delivered","Disputed","Released","Refunded"];
  const stateNames = escrowStateNames;
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeEscrowAddress, setActiveEscrowAddress] = useState(addresses.escrow);


  const handleSelectJob = async (job) => {
  if (!provider) return;
  try {
    setSelectedJob(job);
    setActiveEscrowAddress(job.escrow);

    const escrow = new ethers.Contract(job.escrow, abis.escrow, provider);
    setEscrowContract(escrow);
    await refreshChainState(escrow);
  } catch (e) {
    console.error("Error seleccionando encargo:", e);
  }
};

  
  // Conexión a MetaMask y creación de instancias
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Por favor instala MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const addr = accounts[0];
      setSignerAddress(addr);

      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);


      const factory = new ethers.Contract(
        addresses.jobFactory,
        abis.jobFactory,
        prov
      );
      setJobFactory(factory);

      // Debug
      window._ethers = ethers;
      window._provider = prov;
      window._jobFactory = factory;
      window._myAddress = addr;

      console.log("Conectado como", addr);
      console.log("JobFactory address:", addresses.jobFactory);

      await loadJobs(factory, prov);

      window.ethereum.on &&
        window.ethereum.on("accountsChanged", async (accounts) => {
          if (accounts && accounts[0]) {
            setSignerAddress(accounts[0]);
          }
        });
    } catch (err) {
      console.error("Error initEthereum:", err);
      alert("Error conectando MetaMask: " + (err?.message || err));
    }
  };

  // Cargar encargos + estado on-chain de cada escrow
  const loadJobs = async (factoryInstance = jobFactory, prov = provider) => {
    if (!factoryInstance || !prov) return;
    try {
      const count = await factoryInstance.getJobsCount();
      const n = Number(count);
      console.log("Jobs count:", n);
      const arr = [];
      for (let i = 0; i < n; i++) {
        const job = await factoryInstance.getJob(i);
        console.log("Job", i, job);
        const escrowAddr = job[0];

        // Leer state() de ese escrow concreto
        const escrow = new ethers.Contract(escrowAddr, abis.escrow, prov);
        let escrowState = null;
        try {
          escrowState = await escrow.state();
        } catch (e) {
          console.warn("No se pudo leer state() de", escrowAddr, e);
        }

        arr.push({
          id: i,
          escrow: escrowAddr,
          client: job[1],
          freelancer: job[2],
          title: job[3],
          description: job[4],
          jobSpecIpfsHash: job[5],
          escrowState: escrowState != null ? Number(escrowState) : null,
        });
      }
      setJobs(arr);
    } catch (err) {
      console.error("Error cargando jobs:", err);
    }
  };

  const refreshChainState = async (contractInstance = escrowContract) => {
    if (!contractInstance) return;
    try {
      const [c, f, a, amt, dl, cp, st, dHash, dAt, disp] =
        await Promise.all([
          contractInstance.client(),
          contractInstance.freelancer(),
          contractInstance.arbiter(),
          contractInstance.amount(),
          contractInstance.deadline(),
          contractInstance.challengePeriod(),
          contractInstance.state(),
          contractInstance.deliveredHash(),
          contractInstance.deliveredAt(),
          contractInstance.disputed(),
        ]);

      setClientAddr(c);
      setFreelancerAddr(f);
      setArbiterAddr(a);
      setAmountWei(amt);
      setDeadline(dl);
      setChallengePeriod(cp);
      setState(Number(st));
      setDeliveredHash(dHash);
      setDeliveredAt(Number(dAt) || null);
      setDisputed(disp);
    } catch (err) {
      console.error("Error refrescando estado on-chain:", err);
    }
  };

  // Crear nuevo encargo (job)
  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!provider || !jobFactory) {
      alert("Conecta MetaMask primero");
      return;
    }
    try {
      setIsLoading(true);
      setTxStatus("Creando encargo...");

      const signer = provider.getSigner();
      const amount = ethers.utils.parseEther(newAmountEth);
      const now = Math.floor(Date.now() / 1000);
      const deadlineTs =
        now + Number(newDeadlineDays) * 24 * 60 * 60;

      const tx = await jobFactory
        .connect(signer)
        .createJob(
          newFreelancer,
          newArbiter,
          {
            amount,
            deadline: deadlineTs,
            challengePeriod: Number(newChallengeSeconds),
          },
          newTitle,
          newDescription,
          newIpfsHash
        );

      await tx.wait();
      setTxStatus("✅ Encargo creado");
      await loadJobs(jobFactory, provider);
    } catch (err) {
      console.error("Error creando encargo:", err);
      setTxStatus(
        "❌ Error creando encargo: " + (err?.message || err)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Seleccionar archivo
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    if (!data) {
      setFile(null);
      return;
    }

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      console.log("Archivo cargado:", data.name);
      setFile(Buffer(reader.result));
    };

    e.preventDefault();
  };

  // Subir a IPFS y marcar como entregado
  const handleUploadAndDeliver = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Por favor selecciona un archivo primero");
      return;
    }

    if (!provider || !escrowContract) {
      alert("Por favor conecta MetaMask primero");
      return;
    }

    if (!iAmFreelancer) {
      alert("Solo el freelancer puede marcar entrega");
      return;
    }

    if (state !== 1) {
      alert("El contrato debe estar en estado 'Funded' para entregar");
      return;
    }

    setUploading(true);
    setTxStatus("Subiendo archivo a IPFS...");

    try {
      const client = await create("http://localhost:5001");
      console.log("Conectado a IPFS");

      const result = await client.add(file);
      console.log("Archivo subido a IPFS:", result.cid.toString());

      await client.files.cp(
        `/ipfs/${result.cid}`,
        `/${result.cid}`
      );

      const ipfsHash = result.cid.toString();
      setTxStatus(
        `Archivo en IPFS: ${ipfsHash}. Enviando TX a blockchain...`
      );

      const escrowWithSigner =
        escrowContract.connect(provider.getSigner());
      const tx = await escrowWithSigner.markDelivered(ipfsHash);

      setTxStatus(
        "Transacción enviada. Esperando confirmación..."
      );
      console.log("TX enviada:", tx.hash);

      await tx.wait();
      console.log("TX confirmada");

      setTxStatus("✅ Entrega marcada exitosamente!");
      setDeliveredHash(ipfsHash);

      await refreshChainState();
    } catch (error) {
      console.error("Error:", error);
      setTxStatus(
        "❌ Error: " + (error?.message || error)
      );
      alert(
        "Error al subir archivo o marcar entrega: " +
          error.message
      );
    } finally {
      setUploading(false);
    }
  };

  // Fondear contrato fijo
  const handleFund = async () => {
    if (!iAmClient) {
      alert("Solo el cliente puede fondear");
      return;
    }
    if (state !== 0) {
      alert("El contrato ya fue fondeado");
      return;
    }

    setIsLoading(true);
    setTxStatus("Enviando fondos...");

    try {
      const escrowWithSigner =
        escrowContract.connect(provider.getSigner());
      const tx = await escrowWithSigner.fund({
        value: amountWei,
      });
      setTxStatus(
        "TX enviada, esperando confirmación..."
      );
      await tx.wait();
      setTxStatus("✅ Fondos depositados!");
      await refreshChainState();
    } catch (err) {
      console.error(err);
      setTxStatus("❌ Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Aprobar release
  const handleApproveRelease = async () => {
    if (!iAmClient) {
      alert("Solo el cliente puede aprobar");
      return;
    }
    if (state !== 2) {
      alert("Debe estar en estado 'Delivered'");
      return;
    }

    setIsLoading(true);
    setTxStatus("Aprobando pago...");

    try {
      const escrowWithSigner =
        escrowContract.connect(provider.getSigner());
      const tx = await escrowWithSigner.approveRelease();
      setTxStatus(
        "TX enviada, esperando confirmación..."
      );
      await tx.wait();
      setTxStatus("✅ Pago liberado!");
      await refreshChainState();
    } catch (err) {
      console.error(err);
      setTxStatus("❌ Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers de rol
  const iAmClient =
    signerAddress &&
    clientAddr &&
    signerAddress.toLowerCase() ===
      clientAddr.toLowerCase();
  const iAmFreelancer =
    signerAddress &&
    freelancerAddr &&
    signerAddress.toLowerCase() ===
      freelancerAddr.toLowerCase();
  const iAmArbiter =
    signerAddress &&
    arbiterAddr &&
    arbiterAddr !== ZERO_ADDRESS &&
    signerAddress.toLowerCase() ===
      arbiterAddr.toLowerCase();

  const readableAmount = amountWei
    ? ethers.utils.formatEther(amountWei) + " ETH"
    : "-";

  return (
    <div className="App">
      <header className="App-header">
        <h2>Panel de Encargos Freelance (JobFactory)</h2>
        <p>
          Crea encargos, despliega escrows y gestiona el flujo: Fund → Deliver → Approve / Dispute / Resolve.
        </p>

        {!signerAddress && (
          <button
            className="btn"
            onClick={connectWallet}
          >
            Conectar MetaMask
          </button>
        )}

        {/* Info básica de la cuenta */}
        <div className="card">
          <div>
            <strong>Mi cuenta:</strong>{" "}
            {signerAddress || "-"}
          </div>
        </div>



        {/* Formulario crear encargo */}
        <div className="card">
          <h3>Crear nuevo encargo</h3>
          <form
            onSubmit={handleCreateJob}
            className="form job-form"
          >
            <div className="form-row">
              <input
                type="text"
                placeholder="Dirección del freelancer"
                value={newFreelancer}
                onChange={(e) =>
                  setNewFreelancer(e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Dirección del árbitro (opcional)"
                value={newArbiter}
                onChange={(e) =>
                  setNewArbiter(e.target.value)
                }
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Amount en ETH"
                value={newAmountEth}
                onChange={(e) =>
                  setNewAmountEth(e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Deadline (días desde hoy)"
                value={newDeadlineDays}
                onChange={(e) =>
                  setNewDeadlineDays(e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Challenge (segundos)"
                value={newChallengeSeconds}
                onChange={(e) =>
                  setNewChallengeSeconds(e.target.value)
                }
                required
              />
            </div>
            <input
              type="text"
              placeholder="Título del encargo"
              value={newTitle}
              onChange={(e) =>
                setNewTitle(e.target.value)
              }
              required
            />
            <textarea
              placeholder="Descripción"
              value={newDescription}
              onChange={(e) =>
                setNewDescription(e.target.value)
              }
              rows={3}
            />
            <input
              type="text"
              placeholder="Hash/IPFS del encargo (opcional)"
              value={newIpfsHash}
              onChange={(e) =>
                setNewIpfsHash(e.target.value)
              }
            />
            <button
              className="btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creando..." : "Crear encargo"}
            </button>
          </form>
        </div>

        {/* Lista de encargos */}
        <div className="card">
          <h3>Encargos creados</h3>
          {jobs.length === 0 && (
            <p>No hay encargos todavía.</p>
          )}
          {Array.isArray(jobs) &&
            jobs.map((job) => (
              <div
                key={job.id}
                className="job-item"
              >
                <div className="job-header">
                  <span className="job-id">
                    Encargo #{job.id}
                  </span>
                  <span className="job-escrow">
                    Direccion contrato: {job.escrow}
                  </span>
                  <button className="btn" onClick={() => handleSelectJob(job)}>
                    Gestionar este encargo
                  </button>
                </div>
                <div className="job-title">
                  {job.title}
                </div>
                {job.escrowState != null && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#a8afc3",
                      marginTop: "2px",
                    }}
                  >
                    Estado escrow:{" "}
                    {escrowStateNames[job.escrowState] ??
                      job.escrowState}
                  </div>
                )}
                <div className="job-meta">
                  <div>
                    <strong>Cliente:</strong>{" "}
                    {job.client}
                  </div>
                  <div>
                    <strong>Freelancer:</strong>{" "}
                    {job.freelancer}
                  </div>
                </div>
                {job.description && (
                  <div className="job-description">
                    {job.description}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Acciones del escrow fijo */}
        <div className="actions">
          {iAmClient && state === 0 && (
            <button
              className="btn"
              onClick={handleFund}
              disabled={isLoading}
            >
              {isLoading
                ? "Procesando..."
                : "Fondear contrato de prueba"}
            </button>
          )}

          {iAmFreelancer && state === 1 && (
            <div className="upload-section">
              <h3>Subir entregable</h3>
              <form
                className="form"
                onSubmit={handleUploadAndDeliver}
              >
                <input
                  type="file"
                  name="data"
                  onChange={retrieveFile}
                />
                <button
                  type="submit"
                  className="btn"
                  disabled={uploading || !file}
                >
                  {uploading
                    ? "Subiendo..."
                    : "Subir a IPFS y marcar entrega"}
                </button>
              </form>
            </div>
          )}

          {iAmClient &&
            state === 2 &&
            !disputed && (
              <button
                className="btn"
                onClick={handleApproveRelease}
                disabled={isLoading}
              >
                {isLoading
                  ? "Procesando..."
                  : "Aprobar y liberar pago"}
              </button>
            )}
        </div>

        {txStatus && (
          <div
            className="status"
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "#333",
              borderRadius: "5px",
            }}
          >
            <p>{txStatus}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
