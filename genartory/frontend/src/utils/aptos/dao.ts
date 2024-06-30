// frontend/src/utils/aptos/dao.ts

import { AptosClient, Types } from "aptos";
import { NODE_URL, MODULE_ADDRESS } from "../constants";
import { getConnectedWallet, signAndSubmitTransaction } from "../web3";
import { Proposal } from "./types";
import { toast } from "react-hot-toast";

const client = new AptosClient(NODE_URL);

// Function to create a proposal
export async function createProposal(
  proposalType: number, 
  description: string, 
  parameters?: Uint8Array
): Promise<Types.HexEncodedBytes | null> {
  const account = getConnectedWallet();
  if (!account) throw new Error("Please connect your wallet first");

  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::dao::create_proposal`,
      type_arguments: [],
      arguments: [proposalType, description, parameters || []],
    };

    const txnHash = await signAndSubmitTransaction(account, payload);
    toast.success("Proposal created successfully!");
    return txnHash;
  } catch (error: any) {
    toast.error(error?.message || "Failed to create proposal.");
    return null;
  }
}

// Function to vote on a proposal
export async function voteOnProposal(proposalId: number, vote: boolean): Promise<Types.HexEncodedBytes | null> {
  const account = getConnectedWallet();
  if (!account) throw new Error("Please connect your wallet first");

  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::dao::vote_on_proposal`,
      type_arguments: [],
      arguments: [proposalId, vote],
    };

    const txnHash = await signAndSubmitTransaction(account, payload);
    toast.success("Vote cast successfully!");
    return txnHash;
  } catch (error: any) {
    toast.error(error?.message || "Failed to cast vote.");
    return null;
  }
}

// Function to get proposal details
export async function getProposal(proposalId: number): Promise<Proposal | null> {
  try {
    const proposalResource = await client.getTableItem(
      `${MODULE_ADDRESS}::dao::proposals`,
      {
        key_type: "u64",
        value_type: `${MODULE_ADDRESS}::dao::Proposal`,
        key: proposalId.toString(),
      }
    );
    return proposalResource as Proposal;
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return null;
  }
}
