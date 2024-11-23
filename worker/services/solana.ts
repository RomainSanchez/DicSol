import bs58 from 'bs58';
import { Connection, EpochInfo, Keypair, Transaction, sendAndConfirmTransaction, PublicKey, GetProgramAccountsResponse } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAccount, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Epoch } from "../types";

export class SolanaService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(process.env.RPC!);
  }

  async getCurrentEpoch(): Promise<Epoch> {
    const epochInfo: EpochInfo = await this.connection.getEpochInfo();
  
    const epoch: Epoch = 
    {
      number: epochInfo.epoch,
      progress: Math.round((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100)
    }
  
    return epoch;
  }

  async getTokenAccounts(epoch: Epoch): Promise<GetProgramAccountsResponse> {
    const mint = new PublicKey(process.env.MINT_ADDRESS!);
  
    const accounts = await this.connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          dataSize: 165,
        },
        {
          memcmp: {
            offset: 0,
            bytes: mint.toBase58(),
          },
        },
      ],
    });
  
    return accounts;
  }

  async sendTransaction(recipient: string, amount: number): Promise<string | null> {
    const secret = bs58.decode(process.env.SECRET!)
    const keyPair = Keypair.fromSecretKey(new Uint8Array(Array.from(secret)));
    
    let sourceAccount = await getOrCreateAssociatedTokenAccount(
      this.connection, 
      keyPair,
      new PublicKey(process.env.MINT_ADDRESS!),
      keyPair.publicKey
    );
  
    let destinationAccount = await getAccount(
      this.connection, 
      new PublicKey(recipient)
    );
  
    const tx = new Transaction();
   
    tx.add(createTransferInstruction(
        sourceAccount.address,
        destinationAccount.address,
        keyPair.publicKey,
        amount * Math.pow(10, 9),
    ))
  
    try {
      const latestBlockHash = await this.connection.getLatestBlockhash('confirmed');

      tx.recentBlockhash = await latestBlockHash.blockhash;    
      
      const signature = await sendAndConfirmTransaction(this.connection,tx,[keyPair]);
      console.log( 
        '\x1b[32m', //Green Text
        `\n    https://explorer.solana.com/tx/${signature}`
      );
  
      return signature;
    } catch (e) {
      console.log('Transaction Error: ', e)
      return null;
    }
  }
}