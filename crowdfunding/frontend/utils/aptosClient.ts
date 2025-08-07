import { APTOS_API_KEY, NETWORK } from "@/constants";
// import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import {  Aptos, AptosConfig, Network, NetworkToNetworkName } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK: Network = NetworkToNetworkName[ Network.DEVNET];

// const config = new AptosConfig({ network: APTOS_NETWORK });
  // const aptos = new Aptos(config);

const aptos = new Aptos(new AptosConfig({ network: APTOS_NETWORK, clientConfig: { API_KEY: APTOS_API_KEY } }));

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}
