import React from "react";
import { Modal, Form, Input, Switch, Select, Card } from "antd";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";
import { CustomFormProps, FileType, GroupType, ScheduledMessageType } from "../types";
import TextArea from "antd/es/input/TextArea";
import WhatsAppChatBubble from "./WhatsAppChatBubble";
import ContactSelectOption from "./ContactSelectOption"
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../api/client";

const TemplateForm: React.FC<CustomFormProps<ScheduledMessageType>> = ({ visible, isEditing, onCancel, onOk, errors, form }) => {
  const message = Form.useWatch('message', form);

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getItems<GroupType[]>('/groups'),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  return (
    <Modal
      width={900}
      title={isEditing ? "Edit Scheduled Message" : "Create New Scheduled Message"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
        <SaveButton label={isEditing ? "Update" : "Add"} key='submit' />,
      ]}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20, marginTop: 40 }}>
        <div>
          <Form
            style={{ width: 400 }}
            variant="filled"
            form={form}
            id="form"
            onFinish={onOk}
            requiredMark={false}
            labelCol={{ span: 7 }}
            layout="vertical"
          >
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.join(", ")}
            >
              <Input placeholder="Message name" />
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              validateStatus={errors.message ? "error" : ""}
              help={errors.message?.join(", ")}
            >
              <TextArea
                placeholder="Type your message here"
                autoSize={{ minRows: 3, maxRows: 8 }}
                maxLength={4096}
                showCount />
            </Form.Item>

            <Form.Item
              name="groups"
              label="Group"
            >
              <Select
                mode="multiple"
                placeholder="Select group(s)"
                allowClear
                options={groups?.map((group) => ({ label: group.name, value: group.id })) ?? []}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
              </Select>
            </Form.Item>

            <Form.Item
              label="Contacts"
              name="contacts"
              validateStatus={errors.contact ? "error" : ""}
              help={errors.contact?.join(", ")}
            >
              <ContactSelectOption onChange={(value: number[]) => {
                form.setFieldsValue({ contacts: value });
              }} />
            </Form.Item>

            <Form.Item
              label="Time"
              name="time"
              validateStatus={errors.time ? "error" : ""}
              help={errors.time?.join(", ")}
            >
              <Input placeholder="s m H D M d Y" />

            </Form.Item>

            <Form.Item
              label="Recurring"
              name="recurring"
              validateStatus={errors.recurring ? "error" : ""}
              help={errors.recurring?.join(", ")}
            >
              <Switch />
            </Form.Item>
          </Form>
        </div>


        <WhatsAppChatBubble message={message} file={{} as FileType} />
      </div>

      <Card title="Time Format Guide" style={{ marginTop: 20, marginBottom: 20 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Description</th>
              <th>Allowed value</th>
              <th>Value Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>s</td>
              <td>second</td>
              <td>0-60, *, */(1-60)</td>
              <td>
                * = every second <br />
                */5 = every 5 seconds <br />
              </td>
            </tr>
            <tr>
              <td>m</td>
              <td>minute</td>
              <td>0-60*, */(1-60)</td>
              <td>
                * = every minute <br />
                */5 = every 5 minutes <br />
              </td>
            </tr>
            <tr>
              <td>H</td>
              <td>hour</td>
              <td>0-23, *, */(1-23)</td>
              <td>
                * = every hour <br />
                */5 = every 5 hours <br />
              </td>
            </tr>
            <tr>
              <td>D</td>
              <td>day of month</td>
              <td>1-31, *, */(1-31)</td>
              <td>
                * = every day <br />
                */5 = every 5 days <br />
              </td>
            </tr>
            <tr>
              <td>M</td>
              <td>month</td>
              <td>1-12, *, */(1-12)</td>
              <td>
                * = every month <br />
                */5 = every 5 months <br />
              </td>
            </tr>
            <tr>
              <td>d</td>
              <td>day of week</td>
              <td>0-7, *</td>
              <td>
                0 = Sunday <br />
                1 = Monday <br />
                2 = Tuesday <br />
                3 = Wednesday <br />
                4 = Thursday <br />
                5 = Friday <br />
                6 = Saturday <br />
                7 = Sunday <br />
                * = every day <br />
              </td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ marginBottom: 5 }}>Contoh</h4>
        0 0 12 * * * = setiap hari jam 12:00 <br />
        0 0 8 * * 1 = setiap hari senin jam 08:00 <br />
        0 0 8 1 * * = setiap tanggal 1 jam 08:00 <br />
      </Card>

    </Modal>
  );
};

export default TemplateForm;