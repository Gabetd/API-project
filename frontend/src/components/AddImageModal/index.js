import { useState } from "react";
import { useParams } from "react-router-dom";


function AddImage() {

  const [url, setUrl] = useState('')
  const { spotId } = useParams();

  return (
    <>
      <form className="base-form">
        <label>
          Image Url
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Image</button>
      </form>
    </>
  )

}

export default AddImage;
