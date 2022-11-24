import Web3 from "web3";
import { BigNumber, ethers } from "ethers";
import cloneDeep from "lodash/cloneDeep";
import { Abi } from "@/common/types";
import { NULL_ADDRESS } from "@/common/utils/constants";

export class ContractTask {
  abi = "";
  address = "";
  contract = null as any;

  constructor(abis: Abi[]) {
    let data = abis.find((item) => item.name === "task");
    this.abi = data.abi;
    this.address = data.address;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    this.contract = new ethers.Contract(data.address, cloneDeep(data.abi), signer);
  }

  async createTask(
    userId: string,
    maxHeadCount: number,
    currencyAddress: string,
    fixedAmount: number,
    typeWorkEntry: number,
    title: string,
    description: string,
    duration: number,
    duration_type: string,
    skills: string[],
    category: string
  ) {
    const detailInfo = JSON.stringify({
      title,
      description,
      duration,
      duration_type,
      skills,
      category,
    });
    let value = ethers.BigNumber.from(0);
    if (currencyAddress === NULL_ADDRESS) {
      value = ethers.BigNumber.from(
        (fixedAmount * maxHeadCount)?.toLocaleString("fullwide", {
          useGrouping: false,
        })
      );
    }
    const fixedNumber = ethers.BigNumber.from(
      fixedAmount?.toLocaleString("fullwide", {
        useGrouping: false,
      })
    );
    let response = await this.contract.createTask(userId, maxHeadCount, currencyAddress, fixedNumber, typeWorkEntry, detailInfo, {
      value: value,
    });
    return response;
  }

  async approveMemberJoin(memberId: string, memberWalletId: string, taskId: number) {
    let response = await this.contract.approveUserJoin(memberId, memberWalletId, taskId);
    return response;
  }

  async payForThisMember(memberWalletId: string, taskId: number) {
    let response = await this.contract.markDone(memberWalletId, taskId);
    return response;
  }
}
