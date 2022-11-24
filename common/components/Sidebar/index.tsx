import { getCategories } from "@/common/api/metaData";
import Logo from "@/common/components/Header/Logo";
import { AuthContext, useAuth } from "@/common/hooks/useAuth";
import useDeepCompareEffect from "@/common/hooks/useDeepEffect";
import { fetchData } from "@/common/redux/actions/fetchAction";
import { useAppDispatch, useAppSelector } from "@/common/redux/hooks";
import types from "@/common/redux/types";
import { selectValue } from "@/common/redux/utils";
import { ICategory, UserRole } from "@/common/types";
import { PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Dropdown, Image, Layout, Menu, MenuProps } from "antd";
import { Designtools, Information, Logout, MoreCircle, ProfileCircle, NotificationBing } from "iconsax-react";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import DefaultAvatar from "/public/images/default-avatar.png";
import _map from "lodash/map";
import _isArray from "lodash/isArray";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  onClick?: () => void,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
    type,
    style: {
      padding: "11px 8px",
      margin: 0,
      borderRadius: "4px",
    },
    className: "after:hidden leading-4 font-medium text-sm",
  } as MenuItem;
}

const data = [
  { link: "", label: "Marketing", icon: Information },
  { link: "", label: "Design", icon: Designtools },
];

export function Sidebar() {
  const [current, setCurrent] = useState("");
  const { state } = useContext(AuthContext);
  const { profile, isAuthenticated } = state;
  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { category_id } = router.query;

  const { data: categoryData = [] } = useAppSelector<{ data: ICategory[] }>(selectValue(types.listCategory));

  const goToCreate = () => {
    router.push("/bounty-task/create");
  };

  useEffect(() => {
    if (!categoryData?.length) {
      dispatch(fetchData(types.listCategory, getCategories(null)));
    }
  }, []);

  useDeepCompareEffect(() => {
    if (category_id && !isEmpty(categoryData)) {
      const cate = categoryData.find((item) => item._id === category_id);
      if (cate) {
        setCurrent(cate._id);
      }
    } else {
      setCurrent("All");
    }
  }, [category_id, categoryData]);

  let categories: MenuItem[] = [];
  categories.push(
    getItem("All", "All", <span>🤝</span>, () => {
      router.push(`/bounty-task`);
      setCurrent("All");
    })
  );

  if (_isArray(categoryData)) {
    categories = [
      ...categories,
      ..._map(categoryData, (item, index) =>
        getItem(item.name, item._id, <span>{item.icon}</span>, () => {
          router.push(`/bounty-task?category_id=${item._id}`);
          setCurrent(item._id);
        })
      ),
    ];
  }

  const notificationItems: MenuItem[] = [getItem(<Link href="/notifications">Notifications</Link>, "Notification", <NotificationBing />)];

  const userMenuItems: MenuItem[] = [
    getItem("Profile", "Profile", <ProfileCircle />, () => router.push("/profile")),
    getItem("Logout", "Logout", <Logout />, logout),
  ];

  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={false}
      className={"bg-transparent w-[270px] border-r-[#EAE8F1] border-r-[1px]"}
      width={270}
    >
      <div className="pt-6 pl-10 pr-4">
        <div className="w-[108px] mb-8">
          <Logo />
        </div>

        {profile.role === UserRole.manager && (
          <Button type="primary" size="large" block onClick={goToCreate}>
            <PlusOutlined />
            <span className="font-medium">Create new task</span>
          </Button>
        )}

        <div className="mb-3 mt-5 font-medium text-sm text-[#8F8C9C]">CATEGORY</div>

        <Menu
          // defaultOpenKeys={[]}
          selectedKeys={[current]}
          mode="inline"
          items={categories}
          inlineCollapsed={false}
          className={"border-none"}
        />
      </div>

      <div className="mt-[13px] mb-[25px] pl-10 pr-4">
        <Divider className="border-t-[#EAE8F1] m-0" />
      </div>

      {isAuthenticated && (
        <div className="pl-10 pr-4">
          <Menu
            // defaultOpenKeys={["sub1"]}
            selectedKeys={[current]}
            mode="inline"
            items={notificationItems}
            inlineCollapsed={false}
            className={"border-none"}
          />
        </div>
      )}

      {isAuthenticated && (
        <>
          <div className="mt-[13px] mb-[25px] pl-10 pr-4">
            <Divider className="border-t-[#EAE8F1] m-0" />
          </div>
          <div className="w-full pl-10 pr-5">
            <div className="flex items-center w-full h-10 gap-3">
              <div
                className="flex items-center flex-1 min-w-0 gap-3 cursor-pointer"
                onClick={() => {
                  router.push("/profile");
                }}
              >
                <Avatar
                  size={40}
                  src={<Image src={profile.avatar} fallback={DefaultAvatar.src} preview={false} referrerPolicy={"no-referrer"} />}
                />
                <div className="font-medium text-sm text-[#6C6684] text-ellipsis overflow-hidden whitespace-nowrap">
                  {profile.display_name}
                </div>
              </div>
              <div className="h-6 cursor-pointer">
                <Dropdown
                  overlay={
                    <Menu
                      // defaultOpenKeys={[]}
                      selectedKeys={[current]}
                      mode="inline"
                      items={userMenuItems}
                      inlineCollapsed={false}
                      className={"border-none min-w-[94px]"}
                    />
                  }
                  placement="topRight"
                >
                  <MoreCircle />
                </Dropdown>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout.Sider>
  );
}
