import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import CreateReview from './CreateReview/index.js';


function CreateReviewModal() {
const [createReview, setCreateReview] = useState(false);

return(
  <>
  <button onClick={()=> setCreateReview(true)}>Create Review</button>
  {createModal && (
    <Modal onClose={()=> setCreateReview(false)}>
      <CreateReview setCreateReview={setCreateReview} />
    </Modal>
  )}
  </>
)
}

export default CreateReviewModal;
