// transaction.ts

import { AptosAccount } from "aptos";
import { AptosClient, Types } from "aptos";

/**
 * Signs and submits a transaction to the Aptos blockchain.
 * 
 * @param client - The AptosClient instance to interact with the blockchain.
 * @param account - The AptosAccount instance representing the sender's account.
 * @param payload - The transaction payload to be sent.
 * @returns The hash of the submitted transaction.
 */
async function signAndSubmitTransaction(
  client: AptosClient,
  account: AptosAccount,
  payload: Types.TransactionPayload
): Promise<string> {
  // Create a raw transaction
  const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
    client.getAccount(account.address()),
    client.getChainId(),
  ]);

  const rawTransaction = {
    sender: account.address(),
    sequence_number: sequenceNumber,
    max_gas_amount: "2000",
    gas_unit_price: "1",
    expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 600).toString(),
    payload,
    chain_id: chainId,
  };

  // Sign the transaction
  const signedTransaction = await client.generateBCSTransaction(account, rawTransaction);

  // Submit the transaction
  const transactionHash = await client.submitSignedBCSTransaction(signedTransaction);

  return transactionHash;
}

export { signAndSubmitTransaction };