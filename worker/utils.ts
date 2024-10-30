import { Connection, PublicKey } from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";

interface PlayerAmounts {
    [address: string]: number;
  }

async function snapshot() {
    const connection = new Connection(process.env.RPC_URL!, "confirmed")
    const mintAddress = process.env.LOTTO_MINT_ADDRESS!

    const mint = new PublicKey(mintAddress);
    const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          dataSize: 165, // size of account (bytes)
        },
        {
          memcmp: {
            offset: 0, // location of our query in the account (bytes)
            bytes: mint.toBase58(), // our search criteria, a base58 encoded string
          },
        },
      ],
    });
  
    const nonZeroHolders = accounts
      .map((account) => {
        const accountData = AccountLayout.decode(account.account.data);
        const amount = new BN(accountData.amount.toString(), "le");
  
        return {
          address: account.pubkey.toString(),
          amount: Number(amount.toString()) * 100,
        };
      })
      .filter((holder) => holder.amount !== 0);
  
    const players = nonZeroHolders.reduce<PlayerAmounts>((acc, player) => {
      acc[player.address] = Number(player.amount);
      return acc;
    }, {});
    return players;
  }