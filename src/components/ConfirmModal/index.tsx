import { Button, Modal, Text } from 'native-base';
import React, { FC, memo } from 'react';

interface ConfirmModalProps {
  name: string | null;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  handleDelete: (value: string) => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  name,
  showModal,
  setShowModal,
  handleDelete,
}) => (
  <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
    <Modal.Content maxWidth="300px">
      <Modal.CloseButton />
      <Modal.Header>Delete confirm</Modal.Header>
      <Modal.Body>
        <Text>
          Do you want delete
          {name}
          {' '}
          from history?
        </Text>
      </Modal.Body>
      <Modal.Footer>
        <Button.Group space={2}>
          <Button
            variant="ghost"
            colorScheme="blueGray"
            onPress={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              if (name) {
                handleDelete(name);
                setShowModal(false);
              }
            }}
          >
            Delete
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal.Content>
  </Modal>
);

export default memo(ConfirmModal);
