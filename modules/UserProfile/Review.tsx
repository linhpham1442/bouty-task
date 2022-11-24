import React, { useState, useEffect } from "react";
import { Like1 } from "iconsax-react";
import { Avatar, Rate, Divider, Spin, Empty } from "antd";
import { formatDistanceToNowStrict, subDays } from "date-fns";
import { getRatingList } from "@/common/api/user";
import { handleApi } from "@/common/utils";
import isValidDns from "date-fns/isValid";
import _get from "lodash/get";
import _map from "lodash/map";
import _size from "lodash/size";

interface ReviewProps {
  user_id: string;
}

const Review = ({ user_id = "" }: ReviewProps): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [ratingList, setRatingList] = useState([]);

  const handleGetRatingList = async (user_id: string) => {
    setLoading(true);
    try {
      const { success, data } = await handleApi(getRatingList(user_id), true);
      if (success) {
        setRatingList(_get(data, 'data', []));
      } else {
        setRatingList([]);
      }
    } catch (error) {
      setRatingList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user_id) {
      handleGetRatingList(user_id);
    }
  }, [user_id]);

  return (
    <div className="my-6">
      <div className="flex items-center mb-5">
        <div className="pt-2 mr-3 flex-items">
          <Like1 />
        </div>
        <h2 className="text-xl font-semibold flex-items sm:text-2xl">Review</h2>
      </div>
      {loading ? (
        <div className="text-center">
          <Spin />
        </div>
      ) : _size(ratingList) > 0 ? (
        _map(ratingList, (item, index) => (
          <div className="grid gap-1" key={index.toString()}>
            <div className="flex items-center">
              <Avatar src={_get(item, "owner.avatar", '')} alt={_get(item, "owner.avatar", '')} />
              <div className="text-[16px] font-Roboto text-[#2B1C50] font-medium ml-2">{_get(item, "owner.display_name", '')}</div>
            </div>
            <div className="flex items-center">
              <Rate defaultValue={_get(item, "rating", 0)} />
            </div>
            {isValidDns(new Date(_get(item, "created_at"))) && (
              <div className="text-[14px] font-light">{formatDistanceToNowStrict(new Date(_get(item, "created_at")), { addSuffix: true })}</div>
            )}
            <div className="text-[14px] font-inter font-medium">
              {_get(item, 'comment', '')}
            </div>
            <Divider />
          </div>
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
};
export default Review;
