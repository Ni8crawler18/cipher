import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./idl.json"; // Import the IDL file for your program
import WalletProvider from "./WalletProvider";

// Constants
const programID = new PublicKey("YourProgramID");
const network = "https://api.devnet.solana.com";
const { SystemProgram } = web3;

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    if (window.solana) {
      window.solana.connect({ onlyIfTrusted: true }).then((account) => {
        setWalletAddress(account.publicKey.toString());
      });
    }
  }, []);

  const getProvider = () => {
    const connection = new Connection(network, "processed");
    const provider = new Provider(connection, window.solana, "processed");
    return provider;
  };

  const createInsurancePool = async () => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.createPool(new web3.BN(100), {
      accounts: {
        pool: web3.Keypair.generate().publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });
  };

  return (
    <div>
      {walletAddress ? (
        <div>
          <p>Wallet Connected: {walletAddress}</p>
          <button onClick={createInsurancePool}>Create Insurance Pool</button>
        </div>
      ) : (
        <button
          onClick={() => {
            window.solana.connect().then((account) => {
              setWalletAddress(account.publicKey.toString());
            });
          }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;
