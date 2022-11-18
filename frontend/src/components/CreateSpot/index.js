import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import CreateSpot from './CreateSpot';
import { useSelector } from 'react-redux';


function CreateSpotModal() {
  const sessionUser = useSelector(state => state.session.user);
const [createModal, setCreateModal] = useState(false);

return(
  <>
  <button hidden={!sessionUser} onClick={()=> setCreateModal(true)}>Become a Host</button>
  {createModal && (
    <Modal onClose={()=> setCreateModal(false)}>
      <CreateSpot setCreateModal={setCreateModal} />
    </Modal>
  )}
  </>
)
}

export default CreateSpotModal;
