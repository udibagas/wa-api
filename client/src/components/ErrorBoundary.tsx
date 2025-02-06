import { Button, Result } from 'antd';
import React, { useState, useEffect } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo | null>(null);

  useEffect(() => {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
      setHasError(true);
      setError(error);
      setErrorInfo(errorInfo);
      console.error("ErrorBoundary caught an error", error, errorInfo);
    };

    const errorHandler = (event: ErrorEvent) => {
      handleError(event.error, { componentStack: event.error.stack });
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Result
          status="500"
          title="Whoops!"
          subTitle="Sorry, something went wrong."
          extra={
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => window.location.reload()}
            >
              Back
            </Button>
          }
        />

        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
          <br />
          {errorInfo?.componentStack}
        </details>
      </div >
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;