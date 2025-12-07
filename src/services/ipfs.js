// src/services/ipfs.js
/**
 * Servicio IPFS - Gestión de datos distribuidos
 * Maneja uploads de especificaciones de jobs y entregables
 */

import axios from "axios";

class IPFSService {
  constructor() {
    // Usar Pinata como gateway IPFS (alternativa: usar infura, web3.storage, etc)
    this.gatewayUrl = process.env.REACT_APP_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs";
    this.apiUrl = process.env.REACT_APP_IPFS_API || "http://localhost:5001/api/v0";

    // Para usar Pinata (requiere API key)
    this.pinataUrl = "https://api.pinata.cloud";
    this.pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
    this.pinataSecretKey = process.env.REACT_APP_PINATA_SECRET_KEY;
  }

  /**
   * Sube un archivo JSON a IPFS via Pinata
   * Retorna el CID (Content Identifier)
   */
  async uploadJobSpecification(jobData) {
    try {
      if (!this.pinataApiKey || !this.pinataSecretKey) {
        throw new Error(
          "Credenciales Pinata no configuradas. Configura REACT_APP_PINATA_API_KEY y REACT_APP_PINATA_SECRET_KEY."
        );
      }

      // Preparar datos
      const data = JSON.stringify(jobData);
      const blob = new Blob([data], { type: "application/json" });
      const formData = new FormData();
      formData.append("file", blob, "jobspec.json");

      // Headers con autenticación
      const headers = {
        pinata_api_key: this.pinataApiKey,
        pinata_secret_api_key: this.pinataSecretKey,
      };

      // Upload
      const response = await axios.post(
        `${this.pinataUrl}/pinning/pinFileToIPFS`,
        formData,
        { headers }
      );

      const cid = response.data.IpfsHash;
      console.log("✓ Job specification subida a IPFS:", cid);

      return cid;
    } catch (error) {
      console.error("Error subiendo especificación a IPFS:", error);
      throw error;
    }
  }

  /**
   * Sube un archivo de entregable a IPFS via Pinata
   * Puede ser un archivo, documento, etc
   */
  async uploadDeliverable(file) {
    try {
      if (!this.pinataApiKey || !this.pinataSecretKey) {
        throw new Error(
          "Credenciales Pinata no configuradas."
        );
      }

      // Validar tamaño (máx 100 MB recomendado)
      const maxSize = 100 * 1024 * 1024; // 100 MB
      if (file.size > maxSize) {
        throw new Error(
          `Archivo demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Máximo: 100 MB`
        );
      }

      const formData = new FormData();
      formData.append("file", file);

      const headers = {
        pinata_api_key: this.pinataApiKey,
        pinata_secret_api_key: this.pinataSecretKey,
      };

      const response = await axios.post(
        `${this.pinataUrl}/pinning/pinFileToIPFS`,
        formData,
        { headers }
      );

      const cid = response.data.IpfsHash;
      console.log("✓ Entregable subido a IPFS:", cid);

      return cid;
    } catch (error) {
      console.error("Error subiendo entregable a IPFS:", error);
      throw error;
    }
  }

  /**
   * Obtiene un archivo de IPFS por CID
   */
  async getFile(cid) {
    try {
      const url = `${this.gatewayUrl}/${cid}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo archivo de IPFS:", error);
      throw error;
    }
  }

  /**
   * Obtiene especificación de job por CID
   */
  async getJobSpecification(cid) {
    try {
      const data = await this.getFile(cid);
      return data;
    } catch (error) {
      console.error("Error obteniendo especificación de job:", error);
      throw error;
    }
  }

  /**
   * Genera URL pública para acceder al archivo
   */
  getPublicUrl(cid) {
    return `${this.gatewayUrl}/${cid}`;
  }

  /**
   * Valida que un CID sea válido
   */
  isValidCid(cid) {
    // CIDv0: 46-char string comenzando con Qm
    // CIDv1: starts with "b" y luego base32 encoding
    const cidv0Regex = /^Qm[a-zA-Z0-9]{44}$/;
    const cidv1Regex = /^bafy[a-zA-Z0-9]{55}$/;

    return cidv0Regex.test(cid) || cidv1Regex.test(cid);
  }

  /**
   * Configura credenciales de Pinata
   */
  setPinataCredentials(apiKey, secretKey) {
    this.pinataApiKey = apiKey;
    this.pinataSecretKey = secretKey;
    console.log("✓ Credenciales Pinata actualizadas");
  }

  /**
   * Crea especificación de job estructurada
   */
  createJobSpec(jobData) {
    return {
      version: "1.0",
      title: jobData.title,
      description: jobData.description,
      requirements: jobData.requirements || [],
      deliverables: jobData.deliverables || [],
      client: jobData.client,
      createdAt: new Date().toISOString(),
    };
  }
}

// Exportar instancia singleton
const ipfsService = new IPFSService();
export default ipfsService;
