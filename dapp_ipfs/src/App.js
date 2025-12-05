import React, { useEffect, useState } from "react";
import './App.css';
import { create } from 'kubo-rpc-client';
import { Buffer } from "buffer";
import logo from "./ethereumLogo.png";
import { addresses, abis } from "./contracts";
import { ethers } from "ethers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function formatTimestamp(ts) {
  try {
    if (!ts) return "-";
    const n = Number(ts) * 1000;
    if (isNaN(n)) return "-";
    return new Date(n).toLocaleString();
  } catch (e) { return "-"; }
}

function App() {
  const [provider, setProvider] = useState(null);
  const [escrowContract, setEscrowContract] = useState(null);
  const [signerAddress, setSignerAddress] = useState(null);

  // On-chain state
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

  // Contract states
  const [jobFactory, setJobFactory] = useState(null);
  const [jobs, setJobs] = useState([]);

  // UI state
  const [txStatus, setTxStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // IPFS upload state
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Conexión a MetaMask y creación de contrato
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Por favor instala MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const addr = accounts[0];
      setSignerAddress(addr);

      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);

      const contract = new ethers.Contract(addresses.escrow, abis.escrow, prov);
      setEscrowContract(contract);
      const factory = new ethers.Contract(addresses.jobFactory, abis.jobFactory, prov);
      setJobFactory(factory);

      // Debug (no es realmente necesario, lo incluyo porque tuve algunos problemas y asi es mas facil resolverlos)
      window._jobFactory = factory;

      await loadJobs(factory);


      // Exponer para debug
      window._ethers = ethers;
      window._provider = prov;
      window._escrow = contract;
      window._myAddress = addr;

      console.log('Conectado como', addr);
      console.log('Contract address:', addresses.escrow);

      await refreshChainState(contract);

      window.ethereum.on && window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts && accounts[0]) {
          setSignerAddress(accounts[0]);
          await refreshChainState(contract);
        }
      });

    } catch (err) {
      console.error("Error initEthereum:", err);
      alert("Error conectando MetaMask: " + (err?.message || err));
    }
  };
  const loadJobs = async (factoryInstance = jobFactory) => {
  if (!factoryInstance) return;
  try {
    const count = await factoryInstance.getJobsCount();
    const n = Number(count);
    const arr = [];
    for (let i = 0; i < n; i++) {
      const job = await factoryInstance.getJob(i);
      // job: [escrow, client, freelancer, title, description, jobSpecIpfsHash]
      arr.push({
        id: i,
        escrow: job.escrow,
        client: job.client,
        freelancer: job.freelancer,
        title: job.title,
        description: job.description,
        jobSpecIpfsHash: job.jobSpecIpfsHash
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
      const [c, f, a, amt, dl, cp, st, dHash, dAt, disp] = await Promise.all([
        contractInstance.client(),
        contractInstance.freelancer(),
        contractInstance.arbiter(),
        contractInstance.amount(),
        contractInstance.deadline(),
        contractInstance.challengePeriod(),
        contractInstance.state(),
        contractInstance.deliveredHash(),
        contractInstance.deliveredAt(),
        contractInstance.disputed()
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

    if (state !== 1) { // State.Funded
      alert("El contrato debe estar en estado 'Funded' para entregar");
      return;
    }

    setUploading(true);
    setTxStatus("Subiendo archivo a IPFS...");

    try {
            // Conectar a IPFS local
      const client = await create('http://localhost:5001');
      console.log("Conectado a IPFS");

      // Subir archivo a IPFS
      const result = await client.add(file);
      console.log("Archivo subido a IPFS:", result.cid.toString());

      // Añadir al MFS para visualización en dashboard
      await client.files.cp(`/ipfs/${result.cid}`, `/${result.cid}`);
      
      const ipfsHash = result.cid.toString();
      setTxStatus(`Archivo en IPFS: ${ipfsHash}. Enviando TX a blockchain...`);

      // Llamar a markDelivered en el smart contract
      const escrowWithSigner = escrowContract.connect(provider.getSigner());
      const tx = await escrowWithSigner.markDelivered(ipfsHash);
      
      setTxStatus("Transacción enviada. Esperando confirmación...");
      console.log("TX enviada:", tx.hash);

      await tx.wait();
      console.log("TX confirmada");

      setTxStatus("✅ Entrega marcada exitosamente!");
      setDeliveredHash(ipfsHash);
      
      // Refrescar estado del contrato
      await refreshChainState();

    } catch (error) {
      console.error("Error:", error);
      setTxStatus("❌ Error: " + (error?.message || error));
      alert("Error al subir archivo o marcar entrega: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Función para fondear el contrato (cliente)
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
      const escrowWithSigner = escrowContract.connect(provider.getSigner());
      const tx = await escrowWithSigner.fund({ value: amountWei });
      setTxStatus("TX enviada, esperando confirmación...");
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

  // Función para aprobar release (cliente)
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
      const escrowWithSigner = escrowContract.connect(provider.getSigner());
      const tx = await escrowWithSigner.approveRelease();
      setTxStatus("TX enviada, esperando confirmación...");
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

  // Helpers para roles
  const iAmClient = signerAddress && clientAddr && signerAddress.toLowerCase() === clientAddr.toLowerCase();
  const iAmFreelancer = signerAddress && freelancerAddr && signerAddress.toLowerCase() === freelancerAddr.toLowerCase();
  const iAmArbiter = signerAddress && arbiterAddr && arbiterAddr !== ZERO_ADDRESS && signerAddress.toLowerCase() === arbiterAddr.toLowerCase();

  const readableAmount = amountWei ? ethers.utils.formatEther(amountWei) + ' ETH' : '-';
  const stateNames = ["Created","Funded","Delivered","Disputed","Released","Refunded"];

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Freelance Escrow + IPFS</h2>
        <p>Conecta MetaMask y gestiona el flujo: Fund → Deliver → Approve / Dispute / Resolve</p>

        {!signerAddress && (
          <button className="btn" onClick={connectWallet}>Conectar MetaMask</button>
        )}

        <div className="card">
          <div><strong>Mi cuenta:</strong> {signerAddress || '-'}</div>
          <div><strong>Cliente:</strong> {clientAddr || '-'} {iAmClient && '(TÚ)'}</div>
          <div><strong>Freelancer:</strong> {freelancerAddr || '-'} {iAmFreelancer && '(TÚ)'}</div>
          <div><strong>Árbitro:</strong> {arbiterAddr || '-'} {iAmArbiter && '(TÚ)'}</div>
          <div><strong>Amount:</strong> {readableAmount}</div>
          <div><strong>Deadline:</strong> {formatTimestamp(Number(deadline))}</div>
          <div><strong>Challenge period (s):</strong> {challengePeriod?.toString() || '-'}</div>
          <div><strong>Estado:</strong> {stateNames[state] || state}</div>
          {deliveredHash && (
            <div style={{fontSize: '12px', wordBreak: 'break-all'}}>
              <strong>IPFS Hash:</strong> {deliveredHash}
            </div>
          )}
        </div>
        <div className="card">
          <h3>Jobs creados</h3>
          {jobs.length === 0 && <p>No hay jobs todavía.</p>}
          {jobs.map(job => (
            <div key={job.id} style={{borderTop: '1px solid #444', paddingTop: '8px', marginTop: '8px'}}>
              <div><strong>ID:</strong> {job.id}</div>
              <div><strong>Título:</strong> {job.title}</div>
              <div><strong>Cliente:</strong> {job.client}</div>
              <div><strong>Freelancer:</strong> {job.freelancer}</div>
              <div><strong>Escrow:</strong> {job.escrow}</div>
              {job.jobSpecIpfsHash && (
                <div style={{fontSize: '12px', wordBreak: 'break-all'}}>
                  <strong>Job IPFS:</strong> {job.jobSpecIpfsHash}
                </div>
              )}
              {/* Más adelante aquí pondremos un botón "Abrir este escrow" */}
            </div>
          ))}
        </div>

        {/* Botones de acción según rol y estado */}
        <div className="actions">
          {iAmClient && state === 0 && (
            <button className="btn" onClick={handleFund} disabled={isLoading}>
              {isLoading ? "Procesando..." : "Fondear Contrato"}
            </button>
          )}

          {iAmFreelancer && state === 1 && (
            <div className="upload-section">
              <h3>Subir Entregable</h3>
              <form className="form" onSubmit={handleUploadAndDeliver}>
                <input type="file" name="data" onChange={retrieveFile} />
                <button type="submit" className="btn" disabled={uploading || !file}>
                  {uploading ? "Subiendo..." : "Subir a IPFS y Marcar Entrega"}
                </button>
              </form>
            </div>
          )}

          {iAmClient && state === 2 && !disputed && (
            <button className="btn" onClick={handleApproveRelease} disabled={isLoading}>
              {isLoading ? "Procesando..." : "Aprobar y Liberar Pago"}
            </button>
          )}
        </div>

        {txStatus && (
          <div className="status" style={{marginTop: '20px', padding: '10px', background: '#333', borderRadius: '5px'}}>
            <p>{txStatus}</p>
          </div>
        )}

      </header>
    </div>
  );
}

export default App;
