# BC_IPFS – Freelance Escrow + IPFS + JobFactory

Pequeño proyecto de práctica para la asignatura de *Blockchain & Smart Contracts*.

## Descripción

El proyecto implementa un flujo básico de trabajo entre **cliente** y **freelancer** usando:

- Un contrato `FreelanceEscrow`:
  - Cliente deposita (`fund`)
  - Freelancer marca entrega con hash IPFS (`markDelivered`)
  - Cliente aprueba pago o se abre disputa (con árbitro opcional)
- Un contrato `JobFactory`:
  - Permite crear múltiples encargos (jobs)
  - Cada job despliega su propio `FreelanceEscrow`
  - Guarda metadatos (título, descripción, hash IPFS de la especificación)

El **frontend en React** (dapp) permite:

- Conectar MetaMask
- Fondear el escrow como cliente
- Subir un archivo a IPFS mediante un nodo Kubo en Docker
- Guardar el CID en el contrato como entregable
- (En progreso) Listado y gestión de jobs creados desde `JobFactory`

## Tecnologías

- Solidity `^0.8.30`
- React + ethers.js
- IPFS (Kubo en Docker, con CORS configurado)
- MetaMask

## Ejecución rápida

1. Instalar dependencias del frontend:


npm install
npm start

text

2. Levantar nodo IPFS (ejemplo):

docker run -d --name ipfs_host
-p 4001:4001 -p 5001:5001 -p 8080:8080
ipfs/kubo


3. Desplegar contratos (`FreelanceEscrow` y `JobFactory`) con Remix y actualizar las direcciones en `addresses.js`.

## Estado actual

- Escrow funcional con subida de entregables a IPFS desde `localhost:3000`.
- JobFactory compilando y desplegable, pendiente de integrar completamente en la UI.
