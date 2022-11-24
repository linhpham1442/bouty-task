import { clearAction, fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { getSkills } from "@/common/api/metaData";
import { Select, SelectProps, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";

interface SelectSkillProps extends SelectProps {
  value?: string[];
  categoryId?: string;
  showValue?: boolean;
}
const SelectSkill: React.FC<SelectSkillProps> = ({ showValue, value, categoryId, ...res }) => {
  const dispatch = useAppDispatch();
  const { data: data, loading: loading } = useAppSelector(selectValue(types.inputSkill));
  const cateRef = useRef<string>(null);

  const handleGetAPI = debounce((search) => {
    dispatch(fetchData(types.inputSkill, getSkills(categoryId, search)));
  }, 500);

  useEffect(() => {
    if (loading || (data && data.length > 0)) {
      return;
    }
    handleGetAPI("");

    return () => {
      dispatch(clearAction(types.inputSkill));
    };
  }, []);

  useEffect(() => {
    if (categoryId !== cateRef.current) {
      handleGetAPI("");
      cateRef.current = categoryId;
    }
  }, [categoryId]);

  const options = (data || []).map((sup: any) => ({
    label: `${showValue ? `[${sup._id}]` : ""} ${sup.name}`,
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
      placeholder="Select skill"
      {...res}
      options={options}
    />
  );
};

export default SelectSkill;
