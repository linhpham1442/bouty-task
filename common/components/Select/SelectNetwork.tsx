import { clearAction, fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { getNetworks } from "@/common/api/metaData";
import { Select, SelectProps, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect } from "react";

interface SelectNetworkProps extends SelectProps {
  value?: number[];
  showValue?: boolean;
}
const SelectNetwork: React.FC<SelectNetworkProps> = ({ showValue, value, ...res }) => {
  const dispatch = useAppDispatch();
  const { data: data, loading: loading } = useAppSelector(selectValue(types.inputNetwork));

  const handleGetAPI = debounce((search) => {
    dispatch(fetchData(types.inputNetwork, getNetworks()));
  }, 500);

  useEffect(() => {
    if (loading || (data && data.length > 0)) {
      return;
    }
    handleGetAPI("");

    return () => {
      dispatch(clearAction(types.inputNetwork));
    };
  }, []);

  const options = (data || []).map((sup: any) => ({
    label: `${showValue ? `[${sup.chain_id}]` : ""} ${sup.network_name}`,
    value: sup.chain_id,
  }));

  return (
    <Select
      value={value ? value : null}
      filterOption={false}
      // onSearch={handleGetAPI}
      // showSearch={true}
      loading={loading}
      style={{ width: "100%" }}
      notFoundContent={loading ? <Spin size="small" /> : null}
      placeholder="Select network"
      {...res}
      options={options}
    />
  );
};

export default SelectNetwork;
