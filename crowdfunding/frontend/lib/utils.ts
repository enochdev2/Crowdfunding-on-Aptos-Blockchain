// import { AptosClient } from "@aptos-labs/aptos-sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// export const aptosClient = () => new AptosClient("https://testnet.aptos.dev");
