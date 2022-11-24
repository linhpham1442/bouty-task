import React, { memo, useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { Avatar, Comment, Form, Input, Button as ButtonAnd, List, Tooltip, Spin } from "antd";
import { getListDiscuss, createListDiscuss } from "@/common/api/comment";
import { handleApi } from "@/common/utils";
import { IDiscuss } from "@/common/types";
import { useAuth } from "@/common/hooks/useAuth";
import _map from "lodash/map";
import _get from "lodash/get";
import _size from 'lodash/size';

const { TextArea } = Input;

interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}

const Editor = ({ onChange, onSubmit, submitting, value }: EditorProps) => {
  return (
    <>
      <Form.Item>
        <TextArea rows={4} placeholder="Write something" onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <ButtonAnd htmlType="submit" type="primary" loading={submitting} onClick={onSubmit}>
          Add Comment
        </ButtonAnd>
      </Form.Item>
    </>
  );
};

interface DiscussTabProps {
  bounty_task_id: string;
  activeTab: string;
}

const DiscussTab: React.FC<DiscussTabProps> = (props): JSX.Element => {
  const { bounty_task_id, activeTab } = props;
  const { profile } = useAuth();
  const [comments, setComments] = useState<IDiscuss>({
    count: 0,
    data: [],
    offset: null
  });
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [displayLoadMore, setDisplayLoadMore] = useState(false);
  const limit = 10;
  const offset = _get(comments, "offset");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    if (!value) {
      setSubmitting(false);
      return;
    };
    try {
      const { success } = await handleApi(createListDiscuss(bounty_task_id, value), true);
      if (success) {
        setValue("");
        fetchCommentList(bounty_task_id, false, limit);
      }
    } catch (error) {
      console.log("handleSubmit error", error);
    }
    setSubmitting(false);
  };

  const fetchCommentList = async (bounty_task_id: string, isMore?: boolean, limit?: number, offset?: string) => {
    setLoading(true);
    try {
      const { success, data: dataResponse } = await handleApi(getListDiscuss(bounty_task_id, limit, offset), true);
      if (success) {
        if(_size(_get(dataResponse, 'data.data', [])) >= limit) {
          setDisplayLoadMore(true)
        } else {
          setDisplayLoadMore(false)
        }

        if(isMore) {
          setComments({ count: _get(dataResponse, 'data.count'), offset: _get(dataResponse, 'data.offset'), data: [..._get(comments, 'data', []), ..._get(dataResponse, 'data.data', [])] });
        } else {
          setComments({ count: _get(dataResponse, 'data.count'), offset: _get(dataResponse, 'data.offset'), data: [..._get(dataResponse, 'data.data', []), ...comments.data] });
        }
      } else {
        setComments({
          count: 0,
          data: [],
          offset: null
        });
      }
    } catch (error) {
      setComments({
        count: 0,
        data: [],
        offset: null
      });
      console.log("fetchCommentList error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (bounty_task_id && activeTab === "2") {
      fetchCommentList(bounty_task_id, false, limit);
    }
    return () => setComments({
      count: 0,
      data: [],
      offset: null
    });
  }, [activeTab]);

  const commentsList = _map(_get(comments, "data"), (item) => {
    return {
      author: item?.owner?.display_name,
      avatar: item?.owner?.avatar,
      content: item?.content,
      email: item?.owner?.email,
      datetime: (
        <Tooltip title={`${item?.created_at}`}>
          {item?.created_at ? (
            <span>
              {formatDistance(new Date(item?.created_at), new Date(), {
                addSuffix: true,
              })}
            </span>
          ) : null}
        </Tooltip>
      ),
    };
  });

  return (
    <>
      <div>
        <Comment
          avatar={<Avatar src={profile?.avatar} alt={profile.display_name} />}
          content={<Editor onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} value={value} />}
        />
      </div>
      {isLoading && _size(_get(comments, 'data')) === 0 ? (
        <div className="text-center">
          <Spin />
        </div>
      ) : (
        <div>
          <List
            className="comment-list"
            header={`${commentsList?.length} comments`}
            itemLayout="horizontal"
            dataSource={commentsList}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.email}
                  avatar={<Avatar src={profile?.avatar} alt={profile.display_name} />}
                  content={item.content}
                  datetime={item.datetime}
                />
              </li>
            )}
          />
          {displayLoadMore && (
            <div className="mt-3 text-center">
              <ButtonAnd loading={isLoading} disabled={isLoading} type="primary" onClick={() => fetchCommentList(bounty_task_id, true, limit, offset)}>
                Load more
              </ButtonAnd>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default memo(DiscussTab);
