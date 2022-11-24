import { clearAction, fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { getCategories } from "@/common/api/metaData";
import { Select, SelectProps, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect } from "react";

interface SelectCategoryProps extends SelectProps {
  value?: number[];
  showValue?: boolean;
}
const SelectCategory: React.FC<SelectCategoryProps> = ({ showValue, value, ...res }) => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(selectValue(types.inputCategory));

  const handleGetAPI = debounce((search) => {
    dispatch(fetchData(types.inputCategory, getCategories(search)));
  }, 500);

  useEffect(() => {
    if (loading || (data && data.length > 0)) {
      return;
    }
    handleGetAPI("");

    return () => {
      dispatch(clearAction(types.inputCategory));
    };
  }, []);

  const options = (data || []).map((sup: any) => ({
    label: `${sup.icon} ${showValue ? `[${sup._id}]` : ""} ${sup.name}`,
    value: sup._id,
  }));

  return (
    <Select
      value={value ? value : null}
      filterOption={false}
      onSearch={handleGetAPI}
      showSearch={true}
      loading={loading}
      style={{ width: "100%" }}
      notFoundContent={loading ? <Spin size="small" /> : null}
      placeholder="Select category"
      {...res}
      options={options}
    />
  );
};

export default SelectCategory;
