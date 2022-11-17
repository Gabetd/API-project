
import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import EditSpot from './EditSpotForm';


function EditSpotModal() {
const [createModal, setCreateModal] = useState(false);

return(
  <>
  <button onClick={()=> setCreateModal(true)}>Edit Spot</button>
  {createModal && (
    <Modal onClose={()=> setCreateModal(false)}>
      <EditSpot setCreateModal={true} />
    </Modal>
  )}
  </>
)
}

export default EditSpotModal;
