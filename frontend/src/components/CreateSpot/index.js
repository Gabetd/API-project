import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import CreateSpot from './CreateSpot';


function CreateSpotModal() {
const [createModal, setCreateModal] = useState(false);

return(
  <>
  <button onClick={()=> setCreateModal(true)}>Become a Host</button>
  {createModal && (
    <Modal onClose={()=> setCreateModal(false)}>
      <CreateSpot setCreateModal={true} />
    </Modal>
  )}
  </>
)
}

export default CreateSpotModal;
