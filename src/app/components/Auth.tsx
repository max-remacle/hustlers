import React, { useState } from "react";
import { Form, Input, Button, Typography, Popover, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import styles from "./Auth.module.css";
import { signIn, signUp } from "../lib/auth";
import { getReadableErrorMessage } from "../lib/utilities/Errormap";

const { Title } = Typography;

const content = (
  <div>
    <p>At least 6 characters</p>
    <p>At least 1 uppercase letter</p>
    <p>At least 1 lowercase letter</p>
    <p>At least 1 number</p>
  </div>
);

function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      if (isSignUp) {
        signUp(email, password, firstName, lastName);
      } else {
        await signIn(email, password);
      }
      router.push("/");
    } catch (err: any) {
      const message = getReadableErrorMessage(err.code);
      setError(message);
    }
  };

  const toggleMode = () => {
    setIsSignUp((prevState) => !prevState);
  };
  const forgotPassword = () => {
    console.log("forgot password");
  };

  const isMobileDevice = () => {
    if (typeof window !== "undefined") {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }
  };

  return (
    <div className={styles.container}>
      <Title className={styles.title} level={2}>
        {isSignUp ? "Sign Up" : "Login"}
      </Title>
      <Form onFinish={handleSubmit} className={styles.form}>
        {isSignUp && (
          <>
            <Form.Item
              className={styles.customError}
              name="firstName"
              rules={[
                { required: true, message: "Please Enter your First Name" },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                type="firstName"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value.trim())}
                onFocus={() => setError(null)}
              />
            </Form.Item>
            <Form.Item
              className={styles.customError}
              name="lastName"
              rules={[
                { required: true, message: "Please Enter your Last Name" },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                type="lastName"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value.trim())}
                onFocus={() => setError(null)}
              />
            </Form.Item>
          </>
        )}
        <Form.Item
          className={styles.customError}
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email", message: "The input is not a valid E-mail!" },
          ]}
          validateTrigger="onBlur"
          normalize={(value) => value.trim()}
        >
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value.trim())}
            onFocus={() => setError(null)}
          />
        </Form.Item>
        <Popover
          placement={isMobileDevice() ? "top" : "right"}
          content={content}
        >
          <Form.Item
            className={styles.customError}
            validateTrigger="onBlur"
            name="password"
            rules={[
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(
                      new Error("Please input your Password!")
                    );
                  }
                  const strongPasswordRegex = new RegExp(
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
                  );
                  if (!strongPasswordRegex.test(value)) {
                    return Promise.reject(new Error("Password is too weak!"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              size="large"
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value.trim())}
              onFocus={() => setError(null)}
            />
          </Form.Item>
        </Popover>
        {isSignUp && (
          <Form.Item
            className={styles.customError}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your Password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
            validateTrigger="onBlur"
          >
            <Input
              size="large"
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
              onFocus={() => setError(null)}
            />
          </Form.Item>
        )}
        <Form.Item>
          {error && (
            <Alert
              description={error}
              type="error"
              showIcon
              className={styles.errorMessage}
            />
          )}
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          >
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
          <Button
            size="large"
            type="text"
            onClick={toggleMode}
            style={{ width: "100%", color: "white" }}
          >
            {isSignUp ? "Already a member? Login" : "Not a member? Sign Up"}
          </Button>
          {!isSignUp && (
            <Button
              size="large"
              type="text"
              onClick={forgotPassword}
              style={{ width: "100%", color: "white" }}
            >
              Forgot Password
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}

export default Auth;
