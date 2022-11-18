// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";


// function AddImage({setCreateImage}) {
//   const [url, setUrl] = useState('')
//   const [errors, setErrors] = useState([])
//   const { spotId } = useParams();


//   useEffect(() => {
//     if(!url) setErrors(["please input a url"])
//   }, [url])

//   const onSubmit = await (e) => {
//     e.preventdefault();


//   }



//   return (
//     <>
//       <form className="base-form">
//       <ul>
//         {errors.map((error, idx) => (
//           <li key={idx}>{error}</li>
//         ))}
//       </ul>
//         <label>
//           Image Url
//           <input
//             type="text"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             required
//           />
//         </label>
//         <button type="submit">Add Image</button>
//       </form>
//     </>
//   )

// }

// export default AddImage;
