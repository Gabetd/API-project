
import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import EditSpot from './EditSpotForm';


function EditSpotModal() {
const [editModal, setEditModal] = useState(false);

return(
  <>
  <button onClick={()=> setEditModal(true)}>Edit Spot</button>
  {editModal && (
    <Modal onClose={()=> setEditModal(false)}>
      <EditSpot setEditModal={setEditModal} />
    </Modal>
  )}
  </>
)
}

export default EditSpotModal;
