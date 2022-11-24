import { selectValue } from "@/common/redux/utils";
import { UserToken } from "@/common/types";
import types from "@/common/redux/types";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import { memo, useEffect, useState } from "react";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { createUserToken, getListToken } from "@/common/api/metaData";
import { Button, Divider, Form, FormInstance, Input, message, Modal, Select, SelectProps } from "antd";
import { AddCircle } from "iconsax-react";
import SelectNetwork from "@/common/components/Select/SelectNetwork";
import { ContractToken } from "@/common/services/token";
import useChainId from "@/common/hooks/useChainId";
import { handleApi } from "@/common/utils";
import { NULL_ADDRESS } from "@/common/utils/constants";

interface AddTokenProps extends SelectProps {
  chainId: string;
}

const AddToken = (props: AddTokenProps): JSX.Element => {
  const { chainId } = props;
  const { data, loading } = useAppSelector(selectValue(types.listToken));
  const dispatch = useAppDispatch();
  const [isModal, setIsModal] = useState<boolean>(false);
  const { data: dataNetwork } = useAppSelector(selectValue(types.inputNetwork));

  const [form] = Form.useForm();

  // const handleChange = debounce((searchText: string, page: number) => {
  //   setSearchText(searchText);
  //   reloadData(searchText, page);
  // }, 500);

  const handleClose = () => {
    setIsModal(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      const tokenAddress = values.contract_address;
      const tokenName = values.token_name;
      const { success } = await handleApi(createUserToken(chainId, tokenAddress, tokenName), true);

      if (success) {
        message.success("Add token successfully");
        dispatch(fetchData(types.listToken, getListToken(chainId)));
        handleClose();
      }
    } catch (error) {
      message.success("Add token failed");
    }
  };

  useEffect(() => {
    if (chainId) {
      dispatch(fetchData(types.listToken, getListToken(chainId)));
    }
  }, [dispatch, chainId]);

  return (
    <>
      <Select
        placeholder="Select token"
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider className="my-1" />
            <div className="flex flex-col items-center px-1 py-2 text-center">
              <div className="w-3/4 mb-1 text-xs">To add a bounty, you need to add tokens to pay with</div>
              <Button size="small" className="text-xs" type="primary" onClick={() => setIsModal(true)}>
                Add token
              </Button>
            </div>
          </>
        )}
        loading={loading}
        {...props}
      >
        <Select.Option value={NULL_ADDRESS}>{dataNetwork.find((item: any) => item.chain_id === chainId)?.currency_name}</Select.Option>
        {data?.length > 0
          ? data.map((item: UserToken, index: number) => (
              <Select.Option key={index} value={item.token_address}>
                {item.name}
              </Select.Option>
            ))
          : null}
      </Select>
      <Modal open={isModal} title="Add token" footer={null} onCancel={handleClose} width={600}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            contract_address: "",
            token_name: "",
            token_symbol: "",
            token_decimals: "",
          }}
          onFinish={handleSubmit}
        >
          <AddYourOwnToken form={form} chainId={chainId} />

          <Button type="primary" className="w-full" htmlType="submit">
            Add token
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default memo(AddToken);

function AddYourOwnToken({ form, chainId: networkId }: { form: FormInstance; chainId: string }) {
  const { data } = useAppSelector(selectValue(types.inputNetwork));
  const chainId = useChainId();
  const [isLoopupSuccess, setLoopupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleLookupToken = async () => {
    setLoopupSuccess(false);
    setLoading(true);
    try {
      const tokenAddress = form.getFieldValue("contract_address");
      if (chainId !== networkId) {
        const success = await handleSwitchNetwork(networkId);
        if (!success) return;
      }

      const tokenContract = new ContractToken(tokenAddress);
      const namePromise = tokenContract.getName();
      const symbolPromise = tokenContract.getSymbol();
      const decimalsPromise = tokenContract.getDecimals();

      const [name, symbol, decimals] = await Promise.all([namePromise, symbolPromise, decimalsPromise]);
      form.setFieldsValue({
        token_name: name,
        token_symbol: symbol,
        token_decimals: decimals,
      });
      setLoopupSuccess(true);
    } catch (error) {
      console.log("handleLookupToken error", error);
      message.error("Lookup token failed");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-full">
          <Form.Item name="contract_address" label="Contract address">
            <Input placeholder="Enter contract address..." />
          </Form.Item>
        </div>
        <div className="text-right">
          <Button type="primary" className="mt-[5px]" loading={loading} onClick={handleLookupToken}>
            Lookup
          </Button>
        </div>
      </div>
      {isLoopupSuccess ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-2/4">
              <Form.Item name="token_name" label="Token name">
                <Input disabled />
              </Form.Item>
            </div>
            <div className="w-1/4">
              <Form.Item name="token_symbol" label="Symbol">
                <Input disabled />
              </Form.Item>
            </div>
            <div className="w-1/4">
              <Form.Item name="token_decimals" label="Decimals">
                <Input disabled />
              </Form.Item>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
