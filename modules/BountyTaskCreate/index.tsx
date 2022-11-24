import { createBountyTask } from "@/common/api/bountyTask";
import { BountyTask } from "@/common/types";
import { handleApi } from "@/common/utils";
import { Form, InputNumber, Select, Checkbox, Button, Input, message } from "antd";
import { ArrowLeft2 } from "iconsax-react";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import Editor from "@/common/components/Content";
import AddToken from "./AddToken";
import SelectCategory from "@/common/components/Select/SelectCategory";
import SelectSkill from "@/common/components/Select/SelectSkill";
import SelectNetwork from "@/common/components/Select/SelectNetwork";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { useAppSelector } from "@/common/redux/hooks";
import useChainId from "@/common/hooks/useChainId";
import { ContractTask } from "@/common/services/task";
import { useAuth } from "@/common/hooks/useAuth";
import { ContractToken } from "@/common/services/token";
import { MAX_UNIT, NULL_ADDRESS } from "@/common/utils/constants";
import useMetamask from "@/common/hooks/useMetamask";

const { Option } = Select;

type DataForm = {
  title: string;
  description: string;
  duration: number;
  max_headcount: number;
  duration_type: string;
  skills: string[];
  category: string;
  type_work_entry: number;
  chain_id: string;
  token_address: string;
  fixed_amount: number;
  task_id: number;
};

const BountyTaskCreate = (): JSX.Element => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { data } = useAppSelector(selectValue(types.inputNetwork));
  const { data: dataAbis } = useAppSelector(selectValue(types.listAbis));
  const chainId = useChainId();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const { account, requestNewAccount } = useMetamask();

  const goToList = () => {
    router.push("/bounty-task");
  };

  const handleSwitchNetwork = async (chainId: string) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
      message.success("Switch network successfully");
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          const chainData = data.find((item: any) => item.chain_id === chainId);
          if (chainData) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainData.chain_id,
                  chainName: chainData.network_name,
                  rpcUrls: [chainData.new_rpc_url],
                  blockExplorerUrls: [chainData.block_explorer_url],
                  nativeCurrency: {
                    name: chainData.currency_name,
                    symbol: chainData.currency_symbol,
                    decimals: chainData.decimals,
                  },
                },
              ],
            });

            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: chainId }],
            });

            message.success("Switch network successfully");
            return true;
          } else {
            message.error("Switch network failed");
          }
        } catch (addError) {
          // handle "add" error
          message.error("Switch network failed");
        }
      }

      return false;
    }
  };

  const handleSubmit = async (values: DataForm) => {
    setLoading(true);
    try {
      if (chainId !== values.chain_id) {
        const success = await handleSwitchNetwork(values.chain_id);
        if (!success) {
          setLoading(false);
          return;
        }
      }

      let currentAccount = account;
      if (!account) {
        currentAccount = await requestNewAccount();
      }

      if (profile?.wallet_id?.toLowerCase() !== currentAccount?.toLowerCase()) {
        message.error("Current wallet address active and account wallet config are not match");
        setLoading(false);
        return;
      }

      const dataAbisByChain = dataAbis.filter((item: any) => item.chain_id === values.chain_id);
      const dataAbisTask = dataAbisByChain.find((item: any) => item.name === "task");
      let tokenAddress = values.token_address;
      let decimals = 18;
      if (tokenAddress !== NULL_ADDRESS) {
        const TokenContract = new ContractToken(values.token_address);
        decimals = +(await TokenContract.getDecimals());

        let allowance = await TokenContract.allowance(profile.wallet_id, dataAbisTask.address);
        if (+allowance <= 0) {
          const TokenContract = new ContractToken(values.token_address);
          let tx = await TokenContract.approve(dataAbisTask.address, MAX_UNIT, profile.wallet_id);
          await tx.wait();
        }
      }
      const contractTask = new ContractTask(dataAbisByChain);
      let tx = await contractTask.createTask(
        profile.id,
        values.max_headcount,
        values.token_address,
        values.fixed_amount * Math.pow(10, decimals),
        values.type_work_entry,
        values.title,
        values.description,
        values.duration,
        values.duration_type,
        values.skills,
        values.category
      );
      await tx.wait();
      message.success("Create successfully");
      goToList();
    } catch (error) {
      console.log(error);
      message.error("Error");
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: any) => {
    form.setFieldsValue({ [key]: value });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={
        {
          title: "",
          description: "",
          duration: null,
          duration_type: "hours",
          max_headcount: null,
          category: null,
          skills: [] as string[],
          type_work_entry: 0,
          chain_id: null,
          token_address: null,
          fixed_amount: null,
        } as DataForm
      }
      onFinish={handleSubmit}
    >
      <div className="flex flex-col items-center bg-[#F6F6F9]">
        <div className="flex items-center mt-5 font-medium cursor-pointer" onClick={goToList}>
          <ArrowLeft2 size={14} className="mr-2" />
          <span>Back</span>
        </div>
        <div className="text-[#2B1C50] text-32 font-bold mb-7">Create new task</div>
        <div className="mx-auto w-[638px] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.16)] rounded-lg px-6 py-5">
          <Form.Item
            name="title"
            label={<span className="font-medium">Task title</span>}
            rules={[{ required: true, message: "Cannot be empty" }]}
          >
            <Input placeholder="e.g. Write review" />
          </Form.Item>
          <Form.Item
            name="description"
            label={<span className="font-medium">Task requirement</span>}
            rules={[{ required: true, message: "Cannot be empty" }]}
          >
            <Editor />
          </Form.Item>
          <div className="flex gap-5">
            <div className="w-1/2">
              <div className="font-medium mb-2.5">Duration required</div>
              <div className="flex">
                <Form.Item name="duration" rules={[{ required: true, message: "Cannot be empty" }]}>
                  <InputNumber className="w-[90px] mr-2" controls={false} placeholder="Enter duration" />
                </Form.Item>
                <Form.Item name="duration_type" className="w-full">
                  <Select className="w-full" placeholder="Pick one">
                    <Option value={"hours"}>Hours</Option>
                    <Option value={"days"}>Days</Option>
                    <Option value={"months"}>Months</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="w-1/2">
              <Form.Item
                name="max_headcount"
                label={<span className="font-medium">Maximum headcount</span>}
                rules={[{ required: true, message: "Cannot be empty" }]}
              >
                <InputNumber className="w-full" placeholder="Enter maximum headcount" controls={false} />
              </Form.Item>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item
              name="category"
              rules={[{ required: true, message: "Cannot be empty" }]}
              label={<span className="font-medium">Category</span>}
            >
              <SelectCategory onChange={() => form.setFieldValue("skills", [])} />
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.category !== curValues.category}>
              {() => {
                const category = form.getFieldValue("category");

                return (
                  <Form.Item
                    name="skills"
                    rules={[{ required: true, message: "Cannot be empty" }]}
                    label={<span className="font-medium">Skills</span>}
                  >
                    <SelectSkill mode="multiple" allowClear showArrow categoryId={category} disabled={!category} />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </div>
          <div className="h-px w-full bg-[#EAE8F1] mt-6 mb-5" />
          <div className="mb-3 text-base font-medium">Entry to work on this task</div>
          <Form.Item name="type_work_entry" noStyle hidden>
            <InputNumber />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.type_work_entry !== curValues.type_work_entry}>
            {() => {
              const type_work_entry = form.getFieldValue("type_work_entry");

              return (
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center">
                    <Checkbox
                      checked={type_work_entry === 0}
                      onChange={() => {
                        handleChange("type_work_entry", 0);
                      }}
                    >
                      <div className="text-sm font-normal">Everyone can join</div>
                    </Checkbox>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      checked={type_work_entry === 1}
                      onChange={() => {
                        handleChange("type_work_entry", 1);
                      }}
                    >
                      <span className="text-sm font-normal">Apply to join</span>
                    </Checkbox>
                  </div>
                </div>
              );
            }}
          </Form.Item>

          <div className="h-px w-full bg-[#EAE8F1] mt-6 mb-5" />
          <div className="mb-2 text-base font-semibold">Fixed price</div>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item
              name="chain_id"
              label={<span className="font-medium">Network</span>}
              rules={[{ required: true, message: "Cannot be empty" }]}
            >
              <SelectNetwork onChange={() => form.setFieldValue("token_address", null)} />
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.chain_id !== curValues.chain_id}>
              {() => {
                const chain_id = form.getFieldValue("chain_id");
                return (
                  <Form.Item
                    name="token_address"
                    label={<span className="font-medium">Token</span>}
                    rules={[{ required: true, message: "Invalid address" }]}
                  >
                    <AddToken chainId={chain_id} disabled={!chain_id} />
                  </Form.Item>
                );
              }}
            </Form.Item>

            <Form.Item
              name="fixed_amount"
              label={<span className="font-medium">Fixed amount</span>}
              rules={[{ required: true, message: "Cannot be empty" }]}
            >
              <InputNumber placeholder="Enter fixed amount" style={{ width: "100%" }} controls={false} />
            </Form.Item>
          </div>
        </div>
        <div className="mx-auto w-[638px] flex gap-5 mt-10 mb-16">
          <Button type="default" size="large" onClick={goToList} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" size="large" htmlType="submit" loading={loading}>
            Create task
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default memo(BountyTaskCreate);
