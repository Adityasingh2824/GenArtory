import { WebIrys } from "@irys/sdk";
import { WalletContextState } from "@aptos-labs/wallet-adapter-react";
import { accountAPTBalance } from "./accountBalance";

const getWebIrys = async (aptosWallet: WalletContextState) => {
    const network = "devnet"; //import.meta.env.VITE_APP_NETWORK === "testnet" ? "devnet" : "mainnet"; // Irys network
  const token = "aptos";
  const rpcUrl = "https://fullnode.testnet.aptoslabs.com"; //"testnet";// import.meta.env.VITE_APP_NETWORK; // Aptos network "mainnet" || "testnet"
  
  const wallet = { rpcUrl: rpcUrl, name: "aptos", provider: aptosWallet };
  const webIrys = new WebIrys({ network, token, wallet });
  await webIrys.ready();

  console.log(' getWebIrys irys.ts webIrys', webIrys);
  //please print address
  console.log(' getWebIrys irys.ts wallet', webIrys.address);

  return webIrys;
};



const fetchFileSize = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    const contentLength = response.headers.get('Content-Length');
    if (contentLength) {
      return parseInt(contentLength, 10); // Return size in bytes
    } else {
      throw new Error('Content-Length header is missing');
    }
  } catch (error) {
    console.error(`Error fetching file size for ${imageUrl}:`, error);
    return null; // Return null in case of error
  }
};




export const checkIfFund = async (aptosWallet: WalletContextState, files: File[]) => {
    // 1. estimate the gas cost based on the data size https://docs.irys.xyz/developer-docs/irys-sdk/api/getPrice
    
  const webIrys = await getWebIrys(aptosWallet);
  

    // files.map((f) => {
    //     console.log(' checkIfFund irys.ts f.size', f);
        
    // });    
     
  let totalsize:number  = await fetchFileSize(files);//.then((size) => {console.log('size of image', size);});

let myobj = {
    fileCount: 1,
    totalBytes: totalsize
  }


  const costToUpload = await webIrys.utils.estimateFolderPrice(myobj);
  console.log(' checkIfFund irys.ts costToUpload', costToUpload);
  // 2. check the wallet balance on the irys node: irys.getLoadedBalance()
  const irysBalance = await webIrys.getLoadedBalance();
  console.log(' checkIfFund irys.ts irysBalance', irysBalance);

  // 3. if balance is enough, then upload without funding
  if (irysBalance.toNumber() > costToUpload.toNumber()) {
    return true;
  }

  //print my wallet address
  
  
  // 4. if balance is not enough,  check the payer balance
  const currentAccountAddress = await aptosWallet.account!.address;


console.log('irys.ts curr',currentAccountAddress);

  const currentAccountBalance = await accountAPTBalance({ accountAddress: currentAccountAddress });
  console.log(' checkIfFund irys.ts currentAccountBalance', currentAccountBalance);

  // 5. if payer balance > the amount based on the estimation, fund the irys node irys.fund, then upload
  if (currentAccountBalance > costToUpload.toNumber()) {
    //try {
      console.log(' checkIfFund irys.ts funding node costtoupload',costToUpload.toNumber());
      let myres = await fundNode(aptosWallet, costToUpload);
      console.log(' checkIfFund irys.ts funding node myres', myres);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // } catch (error: any) {
    //   throw new Error(`Error funding node ${error}`);
    // }
  }
  // 6. if payer balance < the amount, replenish the payer balance*/
  return false;
};






export const fundNode = async (aptosWallet: WalletContextState, amount) => {
  const webIrys = await getWebIrys(aptosWallet);

  //try {
    console.log('funding node amount'

    );
    
    //create a bignumber equal to 5000
    const amountQ = webIrys.utils.toAtomic(5000);


    

    const fundTx = await webIrys.fund(amount);
    //const fundTx = await webIrys.fund(amount );
    console.log(`Successfully funded ${webIrys.utils.fromAtomic(fundTx.quantity)} ${webIrys.token}`);
    return true;
  // } catch (e) {
  //   throw new Error(`Error uploading data ${e}`);
  // }
};




export const uploadFile = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aptosWallet: any,
  fileToUpload: File,
): Promise<string> => {
  const webIrys = await getWebIrys(aptosWallet);
  try {

    console.log('uploadFile irys.ts fileToUpload', fileToUpload);
    //	const tags = [{ name: "Content-Type", value: "image/jpeg" }];
    	const tags = [{ name: "Content-Type", value: "image/jpeg" }];
 
    const receipt = await webIrys.uploadFile(fileToUpload, { tags: tags });

    return `https://gateway.irys.xyz/${receipt.id}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(`Error uploading file ${e}`);
  }
};

export const uploadFile2 = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aptosWallet: any,
  fileToUpload: File,
): Promise<string> => {
  const webIrys = await getWebIrys(aptosWallet);
  try {

    console.log('uploadFile irys.ts fileToUpload', fileToUpload.type);
	const tags = [{ name: "Content-Type", value: fileToUpload.type }];
 
    const receipt = await webIrys.uploadFile(fileToUpload, { tags: tags });

    return `https://gateway.irys.xyz/${receipt.id}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(`Error uploading file ${e}`);
  }
};



export const uploadFolder = async (aptosWallet: WalletContextState, files: File[]) => {
  const webIrys = await getWebIrys(aptosWallet);

  try {
    const receipt = await webIrys.uploadFolder(files); //returns the manifest ID

    console.log(
      `Files uploaded. Manifest Id=${receipt.manifestId} Receipt Id=${receipt.id}
      access with: https://gateway.irys.xyz/${receipt.manifestId}/<image-name>`,
    );
    return `https://gateway.irys.xyz/${receipt.manifestId}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(`Error uploading folder ${e}`);
  }
};
