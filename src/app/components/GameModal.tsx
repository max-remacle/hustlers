import React, { useState } from "react";
import { Modal, Button, Input, Form, DatePicker } from "antd";
import { Dayjs } from "dayjs";

import styles from "./GameModal.module.css";

type GameModalProps = {
  modalType: string;
  closeModal: () => void;
  update: boolean | undefined;
};

const GameModal: React.FC<GameModalProps> = ({
  modalType,
  closeModal,
  update,
}) => {
  const [opponent, setOpponent] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);

  const modalStyles = {
    mask: {
      backdropFilter: "blur(20px)",
    },
    content: {
      backgroundColor: "#181818",
    },
  };

  const handleSubmit = async () => {
    try {
      console.log(opponent, field, date?.format("HH:mm"));
    } catch (err: any) {}
  };

  return (
    <>
      <Modal
        className={styles.modal}
        closeIcon={false}
        footer={null}
        styles={modalStyles}
        open={true}
        onCancel={closeModal}
        title={update ? `Update ${modalType}` : `Add ${modalType}`}
      >
        <Form onFinish={handleSubmit} layout="vertical">
          {modalType === "Game" && (
            <>
              <Form.Item
                name="opponent"
                label="Opponent"
                rules={[
                  { required: true, message: "Please Enter an Opponent" },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  size="large"
                  placeholder="Add Opponent"
                  onChange={(e) => setOpponent(e.target.value.trim())}
                />
              </Form.Item>
            </>
          )}
          <Form.Item
            label="Field"
            name="field"
            rules={[{ required: true, message: "Please Enter a Field" }]}
            validateTrigger="onBlur"
          >
            <Input
              size="large"
              placeholder="Add Field"
              onChange={(e) => setField(e.target.value.trim())}
            />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please Enter a Date" }]}
            validateTrigger="onBlur"
          >
            <DatePicker
              use12Hours
              size="large"
              showTime={{ format: "HH:mm" }}
              onChange={(e) => setDate(e)}
              value={date}
            />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: "100%" }}
              size="large"
              type="primary"
              htmlType="submit"
            >
              {update ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default GameModal;
