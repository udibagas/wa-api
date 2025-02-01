import React, { useState } from "react";
import { Table, Form } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import useCrud from "../hooks/useCrud";
import GroupForm from "../components/GroupForm";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/buttons/AddButton";
import ActionButton from "../components/buttons/ActionButton";
import { GroupType } from "../types";

const Group: React.FC = () => {
  const { data: apps, errors, setErrors, addItem, updateItem, showDeleteConfirm } = useCrud<GroupType>("/apps");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleAddGroup = () => {
    setIsEditing(false);
    form.setFieldsValue({ name: "", description: "" });
    setIsModalVisible(true);
  };

  const handleEditGroup = (app: GroupType) => {
    setIsEditing(true);
    form.setFieldsValue(app);
    setIsModalVisible(true);
  };

  const handleModalOk = async (values: GroupType) => {
    console.log(values)
    try {
      if (values.id) {
        await updateItem(values.id, values);
      } else {
        await addItem(values);
      }
      handleModalClose();
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const handleModalClose = () => {
    setErrors({});
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      render: (_: string, __: GroupType, index: number) => index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: <SettingOutlined />,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: string, record: GroupType) => (
        <ActionButton onEdit={() => handleEditGroup(record)} onDelete={() => showDeleteConfirm(record.id)} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Group Management"
        subtitle="Manage your group"
      >
        <AddButton label="Create New Group" onClick={handleAddGroup} />
      </PageHeader>
      <Table
        size="small"
        columns={columns}
        dataSource={apps}
        rowKey="id"
        pagination={false}
        onRow={(record: GroupType) => {
          return {
            onDoubleClick: () => handleEditGroup(record),
          };
        }}
      />

      <GroupForm
        visible={isModalVisible}
        isEditing={isEditing}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        errors={errors}
        form={form}
        initialValues={{ name: "", description: "" } as GroupType}
      />
    </div>
  );
};

export default Group;