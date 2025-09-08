import React, { createContext, useContext, useEffect, useState } from "react";
import { dealerAPI } from "../services/api";
import useLocalStorageState from "use-local-storage-state";
import { mockDealer } from "../mock/mockData";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isDemo, setIsDemo] = useLocalStorageState(
    "anvl_demo",
    { defaultValue: false },
  );
  const [isConnected, setIsConnected] = useLocalStorageState(
    "anvl_wallet_connected",
    { defaultValue: false },
  );
  const [walletAddress, setWalletAddress] = useLocalStorageState(
    "anvl_wallet_address",
    { defaultValue: "" },
  );
  const [dealer, setDealer] = useLocalStorageState("anvl_dealer_data", {
    defaultValue: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);

    try {
      // Check if Polkadot extension is available
      if (typeof window.injectedWeb3 === "undefined") {
        return {
          success: false,
          error:
            "Polkadot extension not found. Please install a Polkadot wallet extension.",
        };
      }

      // Enable the extension
      const extensions = await web3Enable("ANVL Finance");
      if (extensions.length === 0) {
        return {
          success: false,
          error:
            "No Polkadot extension found. Please install and enable a wallet.",
        };
      }

      // Get accounts from extension
      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        return {
          success: false,
          error:
            "No accounts found. Please create or import an account in your wallet.",
        };
      }

      // For simplicity, use the first account
      const account = accounts[0];

      // Create dealer object with wallet info
      const dealerData = {
        ...mockDealer,
        walletAddress: account.address,
      };

      // Update authentication state
      setIsConnected(true);
      setIsDemo(false);
      setWalletAddress(account.address);
      setDealer(dealerData);

      return {
        success: true,
        address: account.address,
      };
    } catch (error) {
      console.error("Failed to connect Polkadot wallet:", error);

      return {
        success: false,
        error: error.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const connectMockWallet = async () => {
    setIsLoading(true);

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsConnected(true);
    setIsDemo(true);
    setWalletAddress(mockDealer.walletAddress);
    setDealer(mockDealer);

    setIsLoading(false);

    return {
      success: true,
      address: mockDealer.walletAddress,
    };
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setIsDemo(false);
    setWalletAddress("");
    setDealer(null);
  };

  const value = {
    isDemo,
    isConnected,
    walletAddress,
    dealer,
    isLoading,
    connectWallet,
    connectMockWallet,
    disconnectWallet,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
