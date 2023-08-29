import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const LocalizedModal = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);
  const hideModal = () => setOpen(false);
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Modal
      </Button>
      <Modal
        title="Modal"
        open={open}
        onOk={hideModal}
        onCancel={hideModal}
        okText="OK"
        cancelText="Cancel"
      >
        <p>Bla bla ...</p>
        <p>Bla bla ...</p>
        <p>Bla bla ...</p>
      </Modal>
    </>
  );
};

export default LocalizedModal;
